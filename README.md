### The RB-Lab's boilerplate to create node microservices

#### How to use it
##### 1. clone repository to your machine
```bash
$ git clone git@github.com:RB-Lab/node-ms-boilerplate.git
```
##### 2. remove all old repository information
```bash
$ rm -rf .git
```
##### 3. set new repository
```bash
$ git init
$ git remote add origin git@github.com:%Username%/%actual-repository%.git
```
##### 4. edit package.json:
- set right `name` and `description`
- replace `author` and `license` if needed
- replace `node-ms-boilerplate` with %actual-repository% name
