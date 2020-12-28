import { modelBindings } from './meta-model/modelBindings';

const rules = modelBindings.reduce((rules, binding) => {
    binding.rules?.forEach(rule => {
        rules.push({
            binding,
            rule,
        });
    });
    return rules;
}, []);


function resolveRule(pkg, ruleName) {
    const rule = rules[ruleName];
    const factory = rule?.rule?.factory;

    if (typeof factory !== 'function') {
        throw new Error('cannot resolve rule <' + pkg + '/' + ruleName + '>');
    }

    return () => {
        const ruleInstance = factory(rule.binding);

        // dirty patch until resolved: https://github.com/bpmn-io/bpmnlint/issues/52
        if (ruleInstance.afterCheck) {
            const _check = ruleInstance.check;
            ruleInstance.check = (node, reporter) => {

                if (!reporter._messages) {
                    reporter._messages = [];
                    reporter.report = (id, message) => {
                        reporter._messages.push({ id, message });
                    }
                    Object.defineProperty(reporter, 'messages', {
                        get: () => {
                            ruleInstance.afterCheck(node, reporter);
                            return reporter._messages;
                        },
                    });
                }
                
                _check(node, reporter);
            }
        }

        return ruleInstance;
    };
}

function resolveConfig(pkg, configName) {
    throw new Error(
        'cannot resolve config <' + configName + '> in <' + pkg + '>'
    );
}

const config = {
    rules: rules.reduce((rules, rule, i) => {
        rules[i] = rule.rule.category;
        return rules;
    }, {}),
};

export const linterConfig = {
    config,
    resolver: {
        resolveConfig,
        resolveRule,
    },
};
