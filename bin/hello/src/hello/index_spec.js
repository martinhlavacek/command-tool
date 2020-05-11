"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var schematics_1 = require("@angular-devkit/schematics");
var testing_1 = require("@angular-devkit/schematics/testing");
var path = __importStar(require("path"));
var collectionPath = path.join(__dirname, '../collection.json');
describe('hello', function () {
    it('works', function () {
        var runner = new testing_1.SchematicTestRunner('schematics', collectionPath);
        var tree = runner.runSchematic('hello', {}, schematics_1.Tree.empty());
        expect(tree.files).toEqual([]);
    });
});
