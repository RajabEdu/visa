"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const cron_execution_1 = __importDefault(require("./cron-execution"));
const retryable_execution_1 = __importDefault(require("./retryable-execution"));
class Workflow extends retryable_execution_1.default {
    static getId() {
        throw new Error('Workflow ID is undefined');
    }
    constructor({ config, logger }) {
        super({ logger });
        this.config = (0, lodash_merge_1.default)(this.buildDefaultConfig(), config);
        this.puppeteer = puppeteer_1.default;
        this.executionState = this.buildExecutionState();
        this.logger = this.logger.child({
            workflowId: this.getId(),
            config: this.config,
            executionState: this.executionState,
        });
    }
    buildDefaultConfig() {
        return {};
    }
    async retryableExecute() {
        try {
            this.executionState.init();
            console.log("ENV:", this.config.env, "KEY:", !!process.env.BROWSERLESS_API_KEY);
            this.logger.debug('Initializing workflow...');
            const page = await this.getOrBuildPage().catch(e => { console.log("BROWSER ERROR:", e.message); throw e; });
            const commands = this.buildCommands({
                logger: this.logger,
                page,
                executionState: this.executionState,
            });
            this.executionState.setTotalOfCommands(commands.length);
            this.executionState.initCommands();
            await this.executeCommands(commands);
        }
        finally {
            this.executionState.finishCommands();
            await this.destroyPage();
            await this.destroyBrowser();
            this.logger.debug('Finishing workflow...');
            this.executionState.finish();
        }
    }
    getId() {
        return this.constructor.getId();
    }
    async executeCommands(commands) {
        for (const nextCommand of commands) {
            this.executionState.nextCommand();
            this.logger.debug('Initializing workflow command...');
            await nextCommand.execute();
            this.logger.debug('Finishing workflow command...');
        }
    }
    async getOrBuildPage() {
        if (!this.page) {
            this.page = await this.buildPage();
        }
        return this.page;
    }
    async buildPage() {
        const browser = await this.getOrBuildBrowser();
        this.logger.debug('Initializing browser page...');
        const [page] = await browser.pages();
        page.setDefaultTimeout(this.config.defaultPuppeteerTimeout);
        return page;
    }
    async getOrBuildBrowser() {
        if (!this.browser) {
            this.browser = await this.buildBrowser();
        }
        return this.browser;
    }
    buildBrowser() {
        const browserOptions = this.buildBrowserOptions();
        this.logger.debug('Launching browser...', { browserOptions });
        const opts=browserOptions;return opts.browserWSEndpoint?puppeteer_1.default.connect(opts):puppeteer_1.default.launch(opts);
    }
    buildBrowserOptions() {
        if (process.env.BROWSERLESS_API_KEY) {
            return {
                browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_KEY}&stealth=true&stealth=true`,
            };
        }
        return {
            headless: false,
            defaultViewport: { width: 1024, height: 768 },
        };
    }
    async destroyPage() {
        if (!this.page) {
            throw new Error('Page has not been initializsed');
        }
        this.logger.debug('Destroying browser page...');
        await this.page.close();
        this.page = undefined;
    }
    async destroyBrowser() {
        if (!this.browser) {
            throw new Error('Browser has not been initializsed');
        }
        this.logger.debug('Destroying browser...');
        await this.browser.close();
        this.browser = undefined;
    }
    getOrBuildCronExecution() {
        if (!this.cronExecution) {
            this.cronExecution = new cron_execution_1.default({
                execute: async () => {
                    await this.execute();
                },
                cronExpression: this.buildCronExpression(),
                logger: this.logger,
            });
        }
        return this.cronExecution;
    }
}
exports.default = Workflow;
