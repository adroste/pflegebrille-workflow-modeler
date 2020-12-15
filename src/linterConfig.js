import { modelerBindings } from './meta-model/modelerBindings';

const rules = modelerBindings.reduce((rules, binding) => {
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

    return () => factory(rule.binding);
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
