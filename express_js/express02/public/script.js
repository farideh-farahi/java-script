const ourRequest = $.ajax({
        method : "POST",
        url : "http://localhost:3000/ajax",
        dataType : "json",
        data : {
            name : "rob"
        },
    })
    ourRequest.then((Response) => {
        console.log(Response)
    })
