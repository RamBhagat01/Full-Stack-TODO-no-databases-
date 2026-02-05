const express = require('express');

const jwt = require ('jsonwebtoken');
const JWT_SECRET = 'ilovecodeing';

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let users = [];

// users = [{
//   username : username,
//   pasword : pasword,
//   todo : [{
//     task : task,
//     id : 1
//   },
//   {task : task,
//     id : 1
//   }]
// }]

app.post('/signup' , function( req , res){

  const {username , pasword} = req.body;

  const match = users.find(
    (user) => user.username === username && user.pasword === pasword
  )

  if(match !== undefined){
    return res.json({
      message : 'User Name already exists !!'
    })
  }

  users.push({
    username : username,
    pasword : pasword,
    todo : []
  })

  res.json({
    message : 'Done, you are signed in !!'
  })


})

app.post('/signin' , function( req , res){

  const {username , pasword} = req.body;

  const match = users.find(
    (user) => user.username === username && user.pasword === pasword
  )

  if (match === undefined){
    return res.json({
      message : 'Please Sign Up first!'
    }
  )}

  const token = jwt.sign({
    username : match.username
  } , JWT_SECRET);

  res.json({
    message: ' Welcome!, you are Signed In',
    token : token

  })

})

function auth(req , res , next){

  const token = req.headers.token;

  if(token === undefined){
    return res.json({
      message : 'Token is empty !!'
    })
  }

  const outputObj = jwt.verify(token , JWT_SECRET);
  const username1 = outputObj.username;

  req.username = username1;

  next();
}

function maching(req , res){

  const match = users.find(
    (user) => user.username === req.username
  );

  if (match === undefined){
    return res.json({
      message : 'Invalid token has received !!'
    })
  }

  return match;
}

app.get('/todos', auth , function( req , res){

 const match = maching(req, res); 

  res.json({
    username : match.username,
    //pasword : match.pasword,
    todo : (match.todo)

  })
 
})

app.post('/task' , auth , function( req , res){

  const {task} = req.body;

  const match = maching(req , res);
  
  match.todo.push({
    task : task,
    id : (match.todo.length)
  })

  res.json({
    message : 'Done adding todo !!',
  })

})

app.post('/delete',auth , function( req , res){

  const id = req.body.id;

  const match = maching(req , res);
  //match.todo.splice(id -1 , 1);

  const array = match.todo.filter(
    task => task.id !== id
  )

  match.todo = array;

  res.json({
    message : 'Done deletion !!',
  })

})


app.listen(3000);
