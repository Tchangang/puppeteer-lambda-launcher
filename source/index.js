const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const tar = require('tar');
const os = require('os');

class ChromeInstaller {
  constructor({
    accessKeyId,
    secretAccessKey,
    s3Bucket,
    s3Key,
    executePath,
    debug,
  }) {
    // url to download chrome
    this.setupChromePath = os.tmpdir();
    this.executablePath = path.join(
      this.setupChromePath,
      executePath,
    );
    // aws keys if not provided will be picked from the system ~/.aws/credentials
    // or if running on AWS Lambda, then from the role assigned to the function
    if (typeof accessKeyId == 'string' && typeof secretAccessKey == 'string') {
 	AWS.config.update({ accessKeyId, secretAccessKey });
    }
    this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    this.s3Bucket = s3Bucket;
    this.s3Key = s3Key;
    if (typeof debug !== 'boolean') {
      this.debug = true;
    } else {
      this.debug = debug;
    }
  }
  log(message, value) {
    if (this.debug) {
      if (value) {
        console.log(message, value);
      } else {
        console.log(message);
      }
    }
  }
  async setupChrome() {
    const alreadyInstalled = await this.existsExecutableChrome();
    if (!alreadyInstalled) {
      this.log('Chrome not yet installed');
      try {
        const res = await this.setupFromS3();
        this.log('Download s3', res);
        this.log('File download exists', alreadyInstalled);
        return true;
      } catch (e) {
        this.log('An error occured when downloading Chrome from S3');
        this.log(e);
        return true;
      }
    } else {
      this.log('Chrome already downloaded');
      return true;
    }
  }

  async existsExecutableChrome() {
    return new Promise((resolve) => {
      fs.access(this.executablePath, fs.constants.F_OK, (err) => {
        if (!err) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  async setupFromS3() {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.s3Bucket,
        Key: this.s3Key,
      };
      this.log('Started download at', new Date().toString());
      this.s3.getObject(params)
        .createReadStream()
        .on('error', err => reject(err))
        .pipe(tar.x({
          C: this.setupChromePath,
        }))
        .on('error', err => reject(err))
        .on('finish', () => {
          this.log('Finished at ', new Date().toString());
        })
        .on('end', () => {
          this.log('Done at ', new Date().toString());
          resolve('done');
        });
    });
  }
}

module.exports = ChromeInstaller;

