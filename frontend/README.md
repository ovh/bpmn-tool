# @ovhcloud/bpmn-tool

> Create and edit Business Process diagram online.

## Prerequisite

Before launch the UI, you must start the backend first (see [documentation](../backend/README.md)).

## Installation

```bash
# Install
$ yarn install

# Copy the .env file
$ cp .env.example .env
```

## Usage

```bash
yarn start
```

The UI will start on port 8080.

## Advanced Usage

```ts
import { bootstrapBpmnTool } from '@ovhcloud/bpmn-tool';

bootstrapBpmnTool();
```

### bootstrapBpmnTool options

In order to customize your `bpmn-tool` modeler, you can pass some options to `bootstrapBpmnTool` function.

#### `modelerOptions` (optional)

##### extensions (optional)

**Type:** `ModdleExtensions`
An object with key the extensions names and value the JSON extensions definitions.
See here for more information about `bpmn-js` extension definition : https://github.com/bpmn-io/bpmn-js-example-model-extension

```ts
import { bootstrapBpmnTool } from '@ovhcloud/bpmn-tool';
import myExtensionJson from './my-extension.json';

bootstrapBpmnTool({
  modelerOptions: {
    extensions: {
      myExtension: myExtensionJson,
    },
  },
});
```

##### modules (optional)

**Type:** `{ disabledInViewer?: boolean = false; declaration: ModuleDeclaration; }[]`
An array containing modules definitions. You can specify if those modules are available or not for viewer instances or not.

For more information about module declaration, see following examples:

- https://github.com/bpmn-io/bpmn-js-example-custom-elements?tab=readme-ov-file#creating-custom-rendering
- https://github.com/bpmn-io/bpmn-js-example-custom-elements/blob/main/app/custom/index.js

```ts
import { bootstrapBpmnTool } from '@ovhcloud/bpmn-tool';
import MyBpmnModule from './my-bpmn-module';
import MyOtherBpmnModule from './my-other-bpmn-module';

bootstrapBpmnTool({
    modelerOptions: {
        modules: [
            { declaration: MyBpmnModule, // by default will be availble in viewer instances },
            {
                disabledInViewer: true,
                declaration: MyOtherBpmnModule,
            }
        ],
    },
});
```

##### providers (optional)

**Type:** `{ priority?: number = 500; instance: new () => unknown; }[]`

A list of provider that will be added to properties panel of your modeler.
For more information, please refer to https://github.com/bpmn-io/bpmn-js-examples/tree/main/properties-panel-extension.

```ts
import { bootstrapBpmnTool } from '@ovhcloud/bpmn-tool';
import MyPropertyPanelProvider from './my-property-panel-provider';

bootstrapBpmnTool({
  modelerOptions: {
    providers: [{ instance: MyPropertyPanelProvider }],
  },
});
```

##### diff (optional)

**Type:** `{ changeHandler?: unknown; }`

You can add here a change handler that will be used to determine if some elements have change in diff view.
For more information, please refer to https://github.com/bpmn-io/bpmn-js-differ/tree/v2.0.2.

```ts
import { bootstrapBpmnTool } from '@ovhcloud/bpmn-tool';
import MyDiffChangeHandler from './my-diff-change-handler';

bootstrapBpmnTool({
  modelerOptions: {
    diff: {
      changeHandler: new MyDiffChangeHandler(),
    },
  },
});
```

##### linting (optional)

**Type:** `{ active?: boolean; bpmnlint: unknown; }`

You can define your linting rules. You first need to add [LintModule](https://github.com/bpmn-io/bpmn-js-bpmnlint) in the `modules` option.
For more information, please refer to https://github.com/bpmn-io/bpmn-js-bpmnlint.

```ts
import { bootstrapBpmnTool } from '@ovhcloud/bpmn-tool';
import LintModule from 'bpmn-js-bpmnlint';
import myLintConfig from './my-lint-config';

bootstrapBpmnTool({
  modelerOptions: {
    modules: [{ disabledInViewer: true, declaration: LintModule }],
    linting: {
      active: true,
      bpmnlint: myLintConfig,
    },
  },
});
```
