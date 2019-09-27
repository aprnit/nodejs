/**
 * http://usejsdoc.org/
 */
// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the Region 
AWS.config.update({region: 'us-east-1'});

AWS.config.getCredentials(function(err) {
	  if (err){ 
		  console.log(err.stack);
	  }
	  // credentials not loaded
	  else {
	    console.log("Access key:", AWS.config.credentials.accessKeyId);
	    console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
	  }
	});

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

// AMI is ami-47d7752c is Backspace Academy (Udemy) Node JS LINUX Image
/**
 * User Data below is following commands encoded in BASE64 (required by AWS
 * #!/bin/bash
 * yum -y update
 * iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
 * iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
 * iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT
 * 
 * This is required because EC2 does not provide access to ports below 1000, and therefore
 * Node JS has to run on 8080, and HTTP requests (port 80) are routed to 8080
 */

var instanceParams = {
   ImageId: 'ami-47d7752c', 
   InstanceType: 't1.micro',
   KeyName: 'ec2-test',
   MinCount: 1,
   MaxCount: 1,
   SecurityGroups: ['webAccess'],
   UserData: "IyEvYmluL2Jhc2gKaXB0YWJsZXMgLUEgUFJFUk9VVElORyAtdCBuYXQgLWkgZXRoMCAtcCB0Y3AgLS1kcG9ydCA4MCAtaiBSRURJUkVDVCAtLXRvLXBvcnQgODA4MAppcHRhYmxlcyAtQSBJTlBVVCAtcCB0Y3AgLW0gdGNwIC0tc3BvcnQgODAgLWogQUNDRVBUCmlwdGFibGVzIC1BIE9VVFBVVCAtcCB0Y3AgLW0gdGNwIC0tZHBvcnQgODAgLWogQUNDRVBU"
};

// Create a promise on an EC2 service object
var instancePromise = new AWS.EC2({apiVersion: '2016-11-15'}).runInstances(instanceParams).promise();

// Handle promise's fulfilled/rejected states
instancePromise.then(
  function(data) {
    console.log(data);
    var instanceId = data.Instances[0].InstanceId;
    console.log("Created instance", instanceId);
    // Add tags to the instance
    var tagParams = {Resources: [instanceId], Tags: [
       {
          Key: 'Name',
          Value: 'SDK Sample'
       }
    ]};
    // Create a promise on an EC2 service object
    var tagPromise = new AWS.EC2({apiVersion: '2016-11-15'}).createTags(tagParams).promise();
    // Handle promise's fulfilled/rejected states
    tagPromise.then(
      function(data) {
        console.log("Instance tagged");
      }).catch(
        function(err) {
        console.error(err, err.stack);
      });
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
