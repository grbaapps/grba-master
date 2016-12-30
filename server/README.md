# All available services

## Registration Services

### Create new Registration

* HTTP Method : POST
* URL Path : /api/registration
* Description : Create a new registration if the the i/p are valid. I/P is expected in the request body.
* Input fields short with Description
```
{  
   "eventCode":"String", // Mandatory field. valid values are defined in config.js file (eventcodes).
   "eventName":"String", //Mandatory field.
   "year":2016,         //Mandatory field. Should be a valid year.
   "data":{  
      "name":"String",  //Mandatory field
      "email":"String", //Mandatory field and should be a valid email id.
      "phoneNo":"String", //optional but if present, it has to be in (111)-111-1111 format only
      "isMember":Boolean,  //Mandatory field.
      "isVegiterian":Boolean, //Mandatory field
      "isStudent":Boolean,  //Mandatory field
      "hasFamily":Boolean,  //Mandatory field
      "noOfAdults":Integer,  //Mandatory field. Should always be Integer, no float/decimal
      "noOfChildren":Integer,   //optional but if present,Should always be Integer, no float/decimal
      "membershipFee":Integer,  //optional but if present,Should always be Integer, no float/decimal and equal to
                                //What is configured in config.js
      "sponsorshipCategory":"String", //optional but if present should match with corresponding event data
      "eventFee":Integer, //mandatory and Integer only
      "specialNote":"String" //Optional with no validation
   }
}
```
* Parameter description and validation rules:

  * **eventCode** :

    * Type - String,
    * Validation Rules:
      * Rule1 - This is a mandatory field and should always be String.
      * Rule2 - Should always match the values defined in config.js file.
    * Validation Error Message - [Event code is a mandatory field,Not a valid event code %{value}]

  * **eventName** :

    * Type - String,
    * Validation Rules:
      * Rule1 - This is a mandatory field and should always be String.
    * Validation Error Message - [Event Name is a mandatory field]
