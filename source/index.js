'use strict';
const AWS = require('aws-sdk');
const fs = require("fs")
const path = require('path')
const tar = require('tar');
const os = require('os')

class ChromeInstaller{
  	constructor({accessKeyId,secretAccessKey,s3Bucket,s3Key,executePath}){
  		// url to download chrome
  		this.setupChromePath =  os.tmpdir()
		this.executablePath = path.join(
		    this.setupChromePath,
		    executePath
		);
		AWS.config.update({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });
		this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
		this.s3Bucket = s3Bucket;
		this.s3Key = s3Key;
  	}

  	async setupChrome(){
  		if(!await this.existsExecutableChrome()){
  			console.log('Chrome not yet installed')
  			try{
  				const res = await this.setupFromS3()
  				console.log('Download s3',res)
  				console.log('File download exists',await this.existsExecutableChrome())
  				// await this.listDirectory()
  				return true
  			}catch(e){
  				console.log('An error occured when downloading Chrome from S3')
  				console.log(e)
  				return true
  			}
  		}else{
  			console.log('Chrome already downloaded')
  			return true
  		}
  	};

  	async listDirectory(){
  		return new Promise((resolve, reject) => {
  			console.log('Listing directories\n--------')
	  		fs.readdir(this.setupChromePath, function(err, items) {
			    for (var i=0; i<items.length; i++) {
			    	if(items[i].indexOf('headless')!=-1 || items[i].indexOf('chromium')!=-1){
			    		console.log(items[i]);
			    	}
			    }
			    console.log('----------')
			    resolve(true)
			})
		})
  	}

  	async existsExecutableChrome(){
	  	return new Promise((resolve, reject) => {
	  		fs.access(this.executablePath, fs.constants.F_OK, (err) => {
	  			if(!err){
	  				resolve(true);
	  			}else {
	  				resolve(false);
	  			}
			});
	  	});
	};

	async setupFromS3(){
		return new Promise((resolve, reject) => {
	    	const params = {
	      		Bucket: this.s3Bucket,
	      		Key: this.s3Key,
	    	};
	    	console.log('Started download at',new Date().toString())
	    	var length = 0;
	    	this.s3.getObject(params)
	    	.createReadStream()
	    	.on('error', (err) => reject(err))
	    	.pipe(tar.x({
	      		C: this.setupChromePath
	    	}))
	    	.on('error', (err) => reject(err))
	    	.on('finish', (err) => {
	    		console.log('Finished at ',new Date().toString())
	    	})
	    	.on('end', () => {
	    		console.log('Done at ',new Date().toString())
	    		resolve('done')
	    	});
	 	});
	};
}

module.exports = ChromeInstaller




