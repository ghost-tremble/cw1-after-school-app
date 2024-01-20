const base_url =  "http://cw-lessons.eu-north-1.elasticbeanstalk.com/api/v1"

// Returns all lessons from the db
const getLessons  =  async ()=>{
    const result = await fetch(`${base_url}/lessons`)
    const lessons = await result.json()
    
    if(!result.ok){
        alert("an error occurred while fetching")
    }


    return lessons.lessons
    

}




