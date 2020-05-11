"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
/**
 * Automatically disable styling applied by chalk if CI=true
 */
if (process.env.CI === 'true') {
    chalk_1.default.level = 0;
}
var CLIOutput = /** @class */ (function () {
    function CLIOutput() {
        this.NX_PREFIX = chalk_1.default.cyan('>') + " " + chalk_1.default.reset.inverse.bold.cyan(' M2STACK ');
        /**
         * Longer dash character which forms more of a continuous line when place side to side
         * with itself, unlike the standard dash character
         */
        this.VERTICAL_SEPARATOR = '———————————————————————————————————————————————';
        /**
         * Expose some color and other utility functions so that other parts of the codebase that need
         * more fine-grained control of message bodies are still using a centralized
         * implementation.
         */
        this.colors = {
            gray: chalk_1.default.gray,
        };
        this.bold = chalk_1.default.bold;
        this.underline = chalk_1.default.underline;
    }
    CLIOutput.prototype.writeToStdOut = function (str) {
        process.stdout.write(str);
    };
    CLIOutput.prototype.writeOutputTitle = function (_a) {
        var label = _a.label, title = _a.title;
        var outputTitle;
        if (label) {
            outputTitle = this.NX_PREFIX + " " + label + " " + title + "\n";
        }
        else {
            outputTitle = this.NX_PREFIX + " " + title + "\n";
        }
        this.writeToStdOut(outputTitle);
    };
    CLIOutput.prototype.writeOptionalOutputBody = function (bodyLines) {
        var _this = this;
        if (!bodyLines) {
            return;
        }
        this.addNewline();
        bodyLines.forEach(function (bodyLine) { return _this.writeToStdOut('  ' + bodyLine + '\n'); });
    };
    CLIOutput.prototype.addNewline = function () {
        this.writeToStdOut('\n');
    };
    CLIOutput.prototype.addVerticalSeparator = function () {
        this.writeToStdOut("\n" + chalk_1.default.gray(this.VERTICAL_SEPARATOR) + "\n\n");
    };
    CLIOutput.prototype.addVerticalSeparatorWithoutNewLines = function () {
        this.writeToStdOut(chalk_1.default.gray(this.VERTICAL_SEPARATOR) + "\n");
    };
    CLIOutput.prototype.error = function (_a) {
        var title = _a.title, slug = _a.slug, bodyLines = _a.bodyLines;
        this.addNewline();
        this.writeOutputTitle({
            label: chalk_1.default.reset.inverse.bold.red(' ERROR '),
            title: chalk_1.default.bold.red(title),
        });
        this.writeOptionalOutputBody(bodyLines);
        /**
         * Optional slug to be used in an Nx error message redirect URL
         */
        if (slug && typeof slug === 'string') {
            this.addNewline();
            this.writeToStdOut(chalk_1.default.grey('  ' + 'Learn more about this error: ') +
                'https://errors.nx.dev/' +
                slug +
                '\n');
        }
        this.addNewline();
    };
    CLIOutput.prototype.warn = function (_a) {
        var title = _a.title, slug = _a.slug, bodyLines = _a.bodyLines;
        this.addNewline();
        this.writeOutputTitle({
            label: chalk_1.default.reset.inverse.bold.yellow(' WARNING '),
            title: chalk_1.default.bold.yellow(title),
        });
        this.writeOptionalOutputBody(bodyLines);
        /**
         * Optional slug to be used in an Nx warning message redirect URL
         */
        if (slug && typeof slug === 'string') {
            this.addNewline();
            this.writeToStdOut(chalk_1.default.grey('  ' + 'Learn more about this warning: ') +
                'https://errors.nx.dev/' +
                slug +
                '\n');
        }
        this.addNewline();
    };
    CLIOutput.prototype.note = function (_a) {
        var title = _a.title, bodyLines = _a.bodyLines;
        this.addNewline();
        this.writeOutputTitle({
            label: chalk_1.default.reset.inverse.bold.keyword('orange')(' NOTE '),
            title: chalk_1.default.bold.keyword('orange')(title),
        });
        this.writeOptionalOutputBody(bodyLines);
        this.addNewline();
    };
    CLIOutput.prototype.success = function (_a) {
        var title = _a.title, bodyLines = _a.bodyLines;
        this.addNewline();
        this.writeOutputTitle({
            label: chalk_1.default.reset.inverse.bold.green(' SUCCESS '),
            title: chalk_1.default.bold.green(title),
        });
        this.writeOptionalOutputBody(bodyLines);
        this.addNewline();
    };
    CLIOutput.prototype.logSingleLine = function (message) {
        this.addNewline();
        this.writeOutputTitle({
            title: message,
        });
        this.addNewline();
    };
    CLIOutput.prototype.logCommand = function (message) {
        this.addNewline();
        this.writeToStdOut(chalk_1.default.bold("> " + message + " "));
        this.addNewline();
    };
    CLIOutput.prototype.log = function (_a) {
        var title = _a.title, bodyLines = _a.bodyLines;
        this.addNewline();
        this.writeOutputTitle({
            title: chalk_1.default.white(title),
        });
        this.writeOptionalOutputBody(bodyLines);
        this.addNewline();
    };
    return CLIOutput;
}());
exports.output = new CLIOutput();
