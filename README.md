# C-SPACE-Tag-Service
The Tag Services will handle all requests with relation to the data of C-\<SPACE> tags. Two APIs are made available to access the service, one for **client** use and the other is for the other **services**. All of the endpoints from the APIs will return a JSON object containing the properties:  
+ `message`: a description of the response; and
+ `payload`: another JSON object containing the requested data 

An example response would look something like this:
```
{
  message: `Succesful`,
  payload: {
    tag: { ... }
  }
}
```
Requirements and options for each endpoint are as follows:


<br/>
 
## for Client  
There are **four** services open for client use. 

#### GET /  
Used to fetch data of multiple users.

 + **Requirement/s**  
   - User is logged in
   
 + **Optiona/s** (Query parameter/s)  
   - `search`: **String** that will be used to match the **tagName** of tags. If none is provided, user documents will be fetched in ascending order of tagName.
   - `limit`: **Number** that will indicate the number of tag documents to be returned.
   - `page`: **Number** that will help determine the number of documents to skip when searching for tags.

#### GET /:id
Used to fetch data of a specific tag with ObjectId equal to given "id"

 + **Requirement/s**  
   - User is logged in

#### GET /author/:id
Used to fetch data of tags authored by user with ObjectId equal to given "id"

 + **Requirement/**
   - User is logged in

#### POST /
Used to create a new tag

 + **Requirement/s**
   - User is logged in
   - Request body containing the `tagnName` and `description`

 <br/>
 
 ## for other Service  
 There is only one endpoint available for other services but it can function in multiple ways depending on a single property in the request body.
 
 #### POST /app-events  
  + **Requirement/s**  
  Request body must contain these two properties:  
    - `event`: **String** that will specify which tag service to access. Possible values are:
      - GET_TAG
      - GET_TAGS_OF_ARRAY
    - `data`: **JSON object** containing required properties.
