# Puppeteer lambda launcher

Drive Chrome headless with Pupetteer on AWS LAMBDA. This module download and install a chromium instance on AWS lambda.

[![npm](https://img.shields.io/npm/v/@serverless-chrome/lambda.svg?style=flat-square)](https://www.npmjs.com/package/@serverless-chrome/lambda)

## Contents
0. [General](#general)
1. [Installation](#installation)
2. [Setup](#setup)


## General
This lib has been built for web scraping and automation after working 2 days on making it working on AWS lambda.

## Installation

Install with npm:

```bash
npm install --save @hackstudio/puppeteer-lambda-launcher
```

## Setup

Use in your AWS Lambda function. Requires Node 6.10.


```js
let ChromeInstaller = require('@hackstudio/puppeteer-lambda-launcher')

ChromeInstaller = new ChromeInstaller({ 
  accessKeyId: 'AKIAxxxxxxxxxxxx', 
  secretAccessKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 
  s3Bucket:'bucket_name_xxx', s3Key:'s3_object_name', 
  executePath:'xxxxxxxxxxxxx'
})

// accessKeyId : get it from your AWS account
// secretAccessKey : get it from your AWS account
// s3Bucket : 'bucket_name' // bucket where compressed chromium is stored. You can download it here : 
// s3Key : 's3_object_name' // key to retrieve object on S3. Ex: headless-chromium.tar.gz
// executePath : 'headless-chromium' // Name of executable path when chromium uncompressed 

// Setup chromium
await ChromeInstaller.setupChrome()

// if chromium is not installed, we will download, decompress it and install in /tmp folder  
const chromePath = ChromeInstaller.executablePath

// Launch puppeteer

const args = [
  '--no-sandbox',
  '--disable-gpu',
  '--disable-setuid-sandbox',
  '--single-process',
  '--headless'
]
const puppeteer = require('puppeteer')
browser = await puppeteer.launch({
  headless: true,
  executablePath: chromePath
  args:args
})

// Enjoy it :-)
```

Feel free to contact me at tchangang.boris+github@gmail.com :-)
