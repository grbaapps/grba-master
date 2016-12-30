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
   "year":Integer,         //Mandatory field. Should be a valid year.
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

  * **year** :

    * Type - Integer,
    * Validation Rules:
      * Rule1 - This is a mandatory field and should always be a valid year.
    * Validation Error Message - [Registration year is a mandatory field]

  * **name** :

    * Type - String,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
    * Validation Error Message - [Name is a mandatory field]

  * **email** :

    * Type - String,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
      * Rule2 - Should always be a valid email id.
    * Validation Error Message - [Email is a mandatory field,Not a valid email id]

  * **phoneNo** :

    * Type - String,
    * Validation Rules:
      * Rule1 - This is an optional field but if present should always conform to the patter (xxx)-xxx-xxxx
    * Validation Error Message - [Not a valid phone number. Valid eg: (111)-111-1111]

  * **isMember** :

    * Type - Boolean,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
      * Rule2 - Should always be of type boolean. Eg "true" is invalid but true is valid.
    * Validation Error Message - [isMember flag can't be empty and should always be boolean type (true or false), isMember should always be boolean (true or false)]  

  * **isVegiterian** :

    * Type - Boolean,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
      * Rule2 - Should always be of type boolean. Eg "true" is invalid but true is valid.
    * Validation Error Message - [isVegiterian flag can't be empty and should always be boolean type (true or false), isVegiterian should always be boolean (true or false)]

  * **isStudent** :

    * Type - Boolean,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
      * Rule2 - Should always be of type boolean. Eg "true" is invalid but true is valid.
    * Validation Error Message - [isStudent flag can't be empty and should always be boolean type (true or false), isStudent should always be boolean (true or false)]

  * **hasFamily** :

    * Type - Boolean,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
      * Rule2 - Should always be of type boolean. Eg "true" is invalid but true is valid.
    * Validation Error Message - [hasFamily flag can't be empty and should always be boolean type (true or false), hasFamily should always be boolean (true or false)]

  * **noOfAdults** :

    * Type - Integer,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
      * Rule2 - if _hasFamily_ is true then field value has to be greater than 1.
      * Rule3 - if _hasFamily_ is false then field value has to be greater than 0.
    * Validation Error Message - [No of adults field is mandatory, Non family participants can't have more than one head count, No of adults can't be less than 1 or real numbers]

  * **noOfChildren** :

    * Type - Integer,
    * Validation Rules:
      * Rule1 - This is an optional field but if present and _hasFamily_ is true then has to be >= 0
      * Rule2 - This is an optional field but if present and _hasFamily_ is false then has to be = 0
    * Validation Error Message - [Number of children can't be less than 0 or real numbers, hasFamily has to be true for someone to bring children]

  * **membershipFee** :

    * Type - Integer,
    * Validation Rules:
      * Rule1 - This is an optional field but if present then it has to exactly match the value configured in config.js
    * Validation Error Message - [Membership fee is $"+config.grbaMembershipFee+" dollars. Please put the exact figure without dollar sign]

  * **sponsorshipCategory** :

    * Type - String,
    * Validation Rules:
      * Rule1 - This is an optional field but if present then it has to exactly match the value configured in proposedEvent.json
    * Validation Error Message - [Not a valid Sponsorship option %{value}. Please contact admin team]

  * **eventFee** :

    * Type - Integer,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
      * Rule2 - If a valid _sponsorshipCategory_ is given the eventFee should be = corresponding Sponsorship option in proposedEvent.json
      * Rule3 - If _sponsorshipCategory_ is not available then _eventFee_ has to match the specific category defined in proposedEvent json file. This rule considers all parameters like earlybird, hasFamily, isStudent, isMember.
    * Validation Error Message - [Event fee is a mandatory field.,Event fee has to match with the corresponding sponsorship option of the event,Event fee is not correct. your event fee is $correct_amount]

  * **specialNote** :

    * Type - String,
    * Validation Rules: No validation rule.
