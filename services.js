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


// Create new order request




// update lessons in database

const updateLessons = async (orderId)=>{
    const result = await fetch(`${base_url}/lessons/${orderId}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const update = await result.json();

    return update
}


const createNewOrder = async (payload)=>{
    const result = await fetch(`${base_url}/order`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    const order = await result.json();
    
    if(!order.success){
        alert(order.message)
    }

    return order

}

const searchLessons = async (query)=>{
    const  result = await fetch(`${base_url}/search?q=${query}`)

    const lessons = await result.json()
    
    if(!lessons.success){
        // return empty array if search empty
       return []
    }


    return lessons.result

}
