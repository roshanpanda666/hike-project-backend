1- create 2 collections - users hikes
2- create the backend just like book with crud features and link of tour of user 
3- first create the backend in one file by self 
4- structure it with MVC

features of this backend is simmilar to books backend 

- user -- create user,delete user,update user,add hike to user (with the id),view all user,view specific user,user with specifics user's hike
- hikes -- create hike , delete hike , update hike ,people coming to this hike (with adding the id of user),all the hike , specific hike via location , specific hike via user (use search in hike)

schemas 

hike -
{ 
    id:default
    name:string
    startdate:date
    enddate:date
    location:string
    difficulty:string
    instructor:string
    peoplecoming:array with id of user
    numberofpeoplecoming:number
    terrain:string
    hiketype:string
}

user - 
{
    id:default
    name:string
    number:number
    hikes:array with id of hike
    experience:string
    follower:array with id of user
    following:array with id of user
    posts:array of string

}


done till now 

- hike and user schema done 

- hike and user router done 
    hike routes -- 
     add hike-    http://localhost:4000/api/hike/create
     get all hike- http://localhost:4000/api/hike/gethikedata
     find specific hike - http://localhost:4000/api/hike/specifichike/6a686b2bdb4874428e179805

    user routes --
     add user - http://localhost:4000/api/user/create
     update hike for user - http://localhost:4000/api/user/edithike/6a686b95db4874428e179806  -- also updates the same user to the hike
     find specific user - http://localhost:4000/api/user/find/6a686b95db4874428e179806
     find similar user - http://localhost:4000/api/user/findsimilaruser/6a685a2914384e4357013b58
     following and followers of user - http://localhost:4000/api/user/increasefollowingof/6a685a2914384e4357013b58

todo -
    add routes - of user
        get all followers of the user 
        get all following of the user 

        add post 
        get all post 
        edit post 
        delete post

        edit experience 

   add routes - of hike 
       edit hike
       delete hike
       edit difficulty 
       edit location 
       edit instructor 
       edit terrain 
       edit hike type
       edit people coming
       edit start date and end date 
       - on a specific hike - find the user based on there experience level and update there role [todo - add role in the user schema]--

            ``js
                const hikes = await Hike.find()
                .populate({
                    path: "peoplecoming",
                    match: { experience: "Beginner" } // Filters the populated array
                });
            ``
         
    this can be done by instructor or hike admin or team leader


