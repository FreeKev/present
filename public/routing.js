$('#delete-user').click(function(e){
  e.preventDefault();
  $.ajax({
    url: $(this).attr('href'),
    method: 'DELETE'
  }).success(function(data){
    window.location.href = '/auth/signup';
  });
});

$('#edit-form').submit(function(e){
  console.log('edit form');
  e.preventDefault();
  $.ajax({
    url: $(this).attr('action'),
    method: 'PUT',
    data: $(this).serialize()
  }).success(function(data){
    window.location.href = '/';
  }).fail(function(err){
    console.log(err);
  });
});
