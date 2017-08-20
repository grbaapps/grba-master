# All available services

## Registration Services

### Create new Registration

* HTTP Method : POST
* URL Path : /api/registration
* Description : Create a new registration if the the i/p are valid. I/P is expected in the request body.
* Success HTTP status code : 200
* Success HTTP response
```
{
  "email": "duplicat4e@gmail.com", //This field can be used for future updates along with year and eventcode
  "totalPaymentAmount": 80 //This field can be useful to authenticate paypal integration.
  "noOfAdults": 12, //Total no of registered adults.
  "noOfChildren": 9 //Total no of registered children.
}
```
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
      "isVegetarian":Boolean, //Mandatory field
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

  * **email** : This is considered unique amonng all registration entries of a prticular event.

    * Type - String,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
      * Rule2 - Should always be a valid email id.
	  * Rule3 - There should not be another registration entry with the same email id for the same event
    * Validation Error Message - [Email is a mandatory field,Not a valid email id,Duplicate registration. Another registration record exist with same email id.]

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

  * **isVegetarian** :

    * Type - Boolean,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
      * Rule2 - Should always be of type boolean. Eg "true" is invalid but true is valid.
    * Validation Error Message - [isVegetarian flag can't be empty and should always be boolean type (true or false), isVegetarian should always be boolean (true or false)]

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
      * Rule1 - This is an optional field but if present then it has to exactly match the value configured in event.json
    * Validation Error Message - [Not a valid Sponsorship option %{value}. Please contact admin team]

  * **eventFee** :

    * Type - Integer,
    * Validation Rules:
      * Rule1 - This is a mandatory field.
      * Rule2 - If a valid _sponsorshipCategory_ is given the eventFee should be = corresponding Sponsorship option in event.json
      * Rule3 - If _sponsorshipCategory_ is not available then _eventFee_ has to match the specific category defined in event json file. This rule considers all parameters like earlybird, hasFamily, isStudent, isMember.
    * Validation Error Message - [Event fee is a mandatory field.,Event fee has to match with the corresponding sponsorship option of the event,Event fee is not correct. your event fee is $correct_amount]

  * **specialNote** :

    * Type - String,
    * Validation Rules: No validation rule.

### Get Registration details

* HTTP Method : GET
* URL Path : /api/registration/year/{numeric_year}/event/{event_code}
* Description : Retrieves the registration details. Can be filtered using query parameters.
* Query Parameters: Optional but can be used to filter.
  * __searchBy__ : Has to be one of the value configured in **searchByOptions** of config js file. Throws validation error if **value** parameter is present and **searchBy** is not. Currently supported values are name, email and sponsorshipCategory. If email is used then the value has to be a valid email otherwise a validation error is thrown. The search for sponsorshipCategory and email is exact search (=) but the search with name is "contains" search.
  * __value__ : Corresponding value to search for.
* Success HTTP status code : 200
* Success HTTP response
```
{
  "totalNoOfRegistrations": 6,
  "lengthOfSearchResult": 2,
  "noOfAdults": 12,
  "noOfChildren": 6,
  "registrations": [
    {
      "name": "SmmeName",
      "email": "name@gmail.com",
      "phoneNo": "(222)-998-1232",
      "isMember": false,
      "isVegetarian": true,
      "isStudent": true,
      "hasFamily": true,
      "noOfAdults": 2,
      "noOfChildren": 1,
      "eventFee": 1200,
      "specialNote": "Some notes",
      "sponsorshipCategory": "Platinum",
      "registrationDate": "01-02-2017 06:39:02"
    },
    {
      "name": "feku",
      "email": "feku@gmail.com",
      "phoneNo": "(222)-998-1232",
      "isMember": false,
      "isVegetarian": true,
      "isStudent": false,
      "hasFamily": false,
      "noOfAdults": 1,
      "noOfChildren": 0,
      "eventFee": 50,
      "specialNote": "Some notes",
      "registrationDate": "01-02-2017 06:39:33"
    }
  ]
```
