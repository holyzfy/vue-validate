import {terser} from "rollup-plugin-terser";
import * as meta from "./package.json";

const config = {
    input: 'index.js',
    output: {
        file: `dist/${meta.name}.js`,
        name: 'validate',
        format: 'umd',
        banner: `// ${meta.homepage} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author}`
    }
};

export default [
    config,
    {
        ...config,
        output: {
            ...config.output,
            file: `dist/${meta.name}.min.js`
        },
        plugins: [
            terser({
                output: {
                    preamble: config.output.banner
                }
            })
        ]
    }
];