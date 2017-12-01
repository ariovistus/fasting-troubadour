import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";
import "./alphanumeric-input-behavior";
import "./formatted-number-behavior";
import "./name-input-behavior";
import "./numeric-input-behavior";
import "./numeric-name-input-behavior";
import "./trim-binding-behavior";
import "./custom-chars-input-behavior";
import "./number-format";

export function configure(config: FrameworkConfiguration) {
    config.globalResources(PLATFORM.moduleName("./alphanumeric-input-behavior"));
    config.globalResources(PLATFORM.moduleName("./formatted-number-behavior"));
    config.globalResources(PLATFORM.moduleName("./name-input-behavior"));
    config.globalResources(PLATFORM.moduleName("./numeric-input-behavior"));
    config.globalResources(PLATFORM.moduleName("./numeric-name-input-behavior"));
    config.globalResources(PLATFORM.moduleName("./trim-binding-behavior"));
    config.globalResources(PLATFORM.moduleName("./custom-chars-input-behavior"));
    config.globalResources(PLATFORM.moduleName("./number-format"));
}

