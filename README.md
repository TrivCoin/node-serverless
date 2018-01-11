### Amazon Linux Setup

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 6.10
node -e "console.log('Running Node.js ' + process.version)"
sudo yum install git
npm i -g serverless
export HOME=~
sudo yum groupinstall "Development Tools"
```

Now you can work.
