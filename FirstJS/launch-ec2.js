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
var instanceParams = {
   ImageId: 'ami-47d7752c', 
   InstanceType: 't1.micro',
   KeyName: 'ec2-test',
   MinCount: 1,
   MaxCount: 1,
   SecurityGroups: ['webAccess']
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
