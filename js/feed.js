$(document).ready(
  function() {
     //updates email verification string
        currentUser = Parse.User.current();
        if (currentUser.attributes.emailVerified === false){
            $("#please_verify").show();
        }
  }
  );
var syncano = SyncanoConnector.getInstance(); 
//POPULATES Feed with Posts

function populatePage(){
  //Connects to Syncano
  var authData = {
    api_key: "b50a00e33bb198286b779a53666249b90eb3f6dc",
    instance: "sparkling-meadow-922472"
  };
  var PROJECT_ID = 6289;
  var COLLECTION_ID = 18888;
    
  syncano.connect(authData, function (auth) {
    console.log("Connected");
  });
    
  syncano.on('syncano:authorized', function(auth){
    console.log("authorized");
  });
    
  var params = {
    include_children: false,
    folders: 'Default'
  }

  // Pulls post objects from Syncano and fills in each template
  syncano.Data.get(PROJECT_ID, COLLECTION_ID, params, function (data) {
    console.log('Received', data.length, 'objects');
    //looping through each object received from Syncano and filling the template
    for (i in data) {
     	var obj = data[i];
      //var yeetChill = '<div class = "squad_post" id="'+obj.id+'" style="display:none"><h2><span id="squad_title">'+obj.title+'</span><span id="post_username"></span></h2><p id="squad_descript">'+obj.text+'</p><p><span class="join-button">Join</span> &nbsp| &nbsp<span class="goon-quantity">0 Goons</span></p></div>'
    	new squadPost(obj.text, obj.title, obj.additional.username, obj.id);
      //$('.feed_div').prepend(yeetChill);
    };
    //Logging each object to the console			
    data.forEach(function (d) {
     	console.log(d);
    });
  });

  syncano.off();
};


function squadPost(descript, title, username, id){

  this.descript = descript,
  this.title = title,
  this.username = username,
  this.id = id

  $("#squad_descript").html(descript);
  $("#squad_title").html(title);
  $("#post_username").html(username);
  $post = $("#template").clone();
  //Gives each div a unique name
  $post.attr("id", id);
  $(".feed_div").prepend($post);
  $post.fadeIn();

  $post.click(function()
  {
    alert(username);
  })

};

populatePage();
//POST A SQUAD
function postSquad(){
  var descript = document.getElementById("new_post_descript").value;
  var title = document.getElementById("new_post_title").value;

  if (title === "title" || descript === "i need a squad for...") {
    return;
  };

  if (title === ""){
    return;
  }

  if (descript === ""){
    return;
  }

  var username = Parse.User.current().getUsername();

  $("#squad_descript").html(descript);
  $("#squad_title").html(title);
  $("#post_username").html(username);
  //$("#squad_post").attr('id', obj.id)
  $post = $("#template").clone();
  //Gives each div a unique name
  //$post.attr("id", obj.id);
  $(".feed_div").prepend($post);
  $post.fadeIn();


  document.getElementById("new_post_descript").value = "";
  document.getElementById("new_post_title").value = "";

  //var syncano = SyncanoConnector.getInstance(); 
  //Project = Squad Finder && Collection = posts
  var PROJECT_ID = 6289;
  var COLLECTION_ID = 18888;

  //Keys
  var authData = {
    api_key: "b50a00e33bb198286b779a53666249b90eb3f6dc",
    instance: "sparkling-meadow-922472"
  };
  
  //syncano.connect(authData, function (auth) {
    //console.log("Connected");
  //Stores post in an object
  var params = {
    title: title,
    text: descript,
    state: 'Moderated',
    additional: {
      username: username,
      joinSquad: joinSquad(this.title)
    }
  };
          
  //Actually pushes object to database
  syncano.Data.new(PROJECT_ID, COLLECTION_ID, params, function(data){
    console.log('Created new data object with ID = ', data.id);
  });
  //});
  //var $div = $("#squad_post").html();
  //$(".content").append($div);
};


//Clears Text from Input Boxes
function clearText(){
  var descript = document.getElementById("new_post_descript").value;
  var title = document.getElementById("new_post_title").value;
  
  if (descript === "i need a squad for...") {
    document.getElementById("new_post_descript").value = "";
  };
  
  if (title === "title") {
    document.getElementById("new_post_title").value = "";
  };
}

function joinSquad(squad){
  var user = Parse.User.current();
  user.addUnique("squads", squad);
  user.save();
}



