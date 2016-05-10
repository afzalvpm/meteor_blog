import { Mongo } from 'meteor/mongo';
document.title = "Meteor Demo";
MyCollection = new Mongo.Collection('tasks');

if (Meteor.isClient) {
   Template.posts.helpers({
      posts: function() {
      
      if(Session.get('hideFinished')){
        console.log(true)

        return 0;
      }else
      {
        return MyCollection.find();
      }
      
    },
    'isOwner':function(){
      return this.owner === Meteor.userId();
    },
    hideFinished:function(){
      return Session.get('hideFinished')
    }
  })


}

if(Meteor.isServer){

}


Template.body.events({
    // events go here
    
    'submit .addNew': function(event){
      event.preventDefault();
      var title = event.target.postTitle.value;
      var content = event.target.contentValue.value;
      var myData = {
         title:title ,
         content:content,
         comments:[]

      }
      if (title.length){
      MyCollection.insert(myData);
      console.log(MyCollection.find().count());
       event.target.contentValue.value ="";
       event.target.postTitle.value ="";
      }
     
    },
      'change .hideAll':function(event){
    Session.set('hideFinished',event.target.checked);
    console.log(Session.get('hideFinished'))
    
  }

});
Template.posts.events({
  'click .deletePost': function(event){
    event.preventDefault();
    var id = $(event.target).parent().data('id')
    var r = confirm("Are u Sure to remove?");
    if (r == true) {
      MyCollection.remove({'_id':id});
    }
    
  },
  'click .savePost': function(event){
    event.preventDefault();
    $(event.target).addClass('hide');;
    var id = $(event.target).parent().data('id');
    var title = $(event.target).parent().find('.postHead').text();
    var content = $(event.target).parent().find('.postContent').text();
    $(event.target).parent().find('.editPost').removeClass('hide');
    $(event.target).parent().find('.postHead').text('');
    $(event.target).parent().find('.postContent').text('');
        $(event.target).parent().find('.postHead').removeAttr('contenteditable');
    $(event.target).parent().find('.postContent').attr('contenteditable');
    MyCollection.update({_id:id},{$set:{'title':title,'content':content}})
    
  },
  //add content Editable
  'click .editPost': function(event){
    event.preventDefault();
    $(event.target).addClass('hide');
    $(event.target).parent().find('.savePost').removeClass('hide');
    $(event.target).parent().find('.postHead').attr('contenteditable',true);
    $(event.target).parent().find('.postContent').attr('contenteditable',true);
    
  },
  'submit .commentForm': function(event1){
    event.preventDefault();
    console.log(event.target.comment.value);
    var id = $(event.target).parent().data('id');
    var comment = event.target.comment.value;
    // var commentArray =
    event.target.comment.value ="";
    MyCollection.update({_id:id},{$push:{'comments':comment}})
    
  },
  'click .editComment': function(event){
    event.preventDefault();
    $(event.target).addClass('hide');
    $(event.target).parent().find('.saveComment').removeClass('hide');
    // $(event.target).parent().find('.postHead').attr('contenteditable',true);
    // console.log($(event.target).parent())
    $(event.target).parent().find('.commentText').attr('contenteditable',true);
    
  },
    'click .saveComment': function(event){
    event.preventDefault();
    $(event.target).addClass('hide');
    var id = $(event.target).parent().parent().data('id')
    newValue = $(event.target).parent().find('.commentText').text();
    $(event.target).parent().find('.commentText').text('')
    $(event.target).parent().find('.editComment').removeClass('hide');
    var value = $(event.target).parent().data('value');

    // MyCollection.update({'_id':id},{$set:{'comments':{}});
    $('.commentText').text('')
    // alert(newValue)
    MyCollection.update({_id:id},{$set:{'comments':value}})
    
  },
  'click .deleteComment': function(event){
    event.preventDefault();
    var id = $(event.target).parent().parent().data('id');
    var value = $(event.target).parent().data('value');
    var r = confirm("Are u Sure to remove?");
    if (r == true) {
      MyCollection.update({'_id':id},{$pull:{'comments':value}});
      // $(event.target).closest('.deleteComment').data('value',0)

    }
    
  },

  

});
