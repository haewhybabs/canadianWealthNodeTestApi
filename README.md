# canadianWealthNodeTestApi    
## Installation
follow the following commands to get it started:

* git clone https://github.com/haewhybabs/canadianWealthNodeTestApi.git
* npm install , to install all the dependencies used in package.json
* start the server with "nodemon"

## Documentation
There are 6 endppoints for the API
* **Registration** : post request to;   "servername"/users/registration , with **name,email,password,password_confirmation and phoneNumber for the input post**

*  **Login :** post request to ; "servername"/users/login , with **email** and **password** for the input post
* **Reset Password :** post request to ; "servername"/user/reset-password . ....
* **Profile :** post request to ; "servername"/profile . It will give the profile details. The *authorization* token is required for the request
* **Upload Image  :** post request to ; "servername"/profile/upload.The *authorization* token, *profileImage* are required for the request
* **Profile Update :** post request to ; "servername"/profile/update.The *authorization* token,name,phoneNumber are required

#### PostMan Collection link
https://www.getpostman.com/collections/6c02cb9dc575ee0d48b9

## Author
**Ayobami Babalola**


