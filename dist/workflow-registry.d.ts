import { Logger } from 'winston';
import Workflow from "./workflow";
import { Config, ConstructorOf } from "./types";
export default class WorkflowRegistry {
    private static instance;
    private workflowClasses;
    static getOrInitialize(): WorkflowRegistry;
    private constructor();
    registerWorkflowClass(WorkflowClass: ConstructorOf<Workflow>): WorkflowRegistry;
    private getIdOfWorkflowClass;
    unregisterWorkflowClass(WorkflowClass: ConstructorOf<Workflow>): WorkflowRegistry;
    resetWorkflowClasses(): WorkflowRegistry;
    buildWorkflows({ config, logger }: {
        config: Config;
        logger: Logger;
    }): Workflow[];
    private loadWorkflowClasses;
}
