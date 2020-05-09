const {
    override,
    addBabelPlugin,
} = require("customize-cra");
const rewireYarnWorkspaces = require('react-app-rewire-yarn-workspaces');

module.exports = override(
    addBabelPlugin([
        "babel-plugin-root-import",
        {
            paths: [
                {
                    rootPathSuffix: "src",
                    rootPathPrefix: "~"
                }
            ]
        }
    ]),
)