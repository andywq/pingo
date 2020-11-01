module.exports = {
  apps: [
    {
      name: "pingo",
      script: "dist/main.js",

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      instances: 4,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  deploy: {
    production: {
      user: "root",
      host: "api.pingo.alexyan.cc",
      key: "~/.ssh/id_rsa",
      ref: "origin/master",
      repo: "git@github.com:alexmaze/pingo.git",
      path: "/var/www/api.pingo.alexyan.cc",
      "pre-setup": "git reset --hard HEAD",
      "post-deploy":
        "yarn && ln -sf /root/configs/pingo.json ./config/production.json && npm run prestart:prod && pm2 reload ecosystem.config.js --env production"
    }
  }
}
