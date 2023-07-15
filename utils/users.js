const users=[];

function userjoin(id,username,room){
   const user={ id,username,room}

   users.push(user);
   return user;
}

function getcurrentUser(id){
    return users.find(user=>user.id===id)
}

function userleaves(id){
    const index=users.findIndex(user=>user.id===id);

    if(index!==-1){
        return users.splice(index,1)[0];
    }
}

function getuserrooms(room){
    return users.filter(user=>user.room===room)
}

module.exports={
    userjoin,
    getcurrentUser,
    userleaves,
    getuserrooms
}