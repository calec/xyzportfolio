exports.onCreateWebpackConfig = ({ actions, loaders }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /node_modules\/react-draggable/,
          use: [loaders.js()],
        },
      ],
    },
  })
}
