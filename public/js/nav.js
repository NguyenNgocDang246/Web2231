$(document).ready(function () {
    $.ajax({
        url: '/api/isGuest',
        method: 'GET',
        success: function (data) {
            if (data.isGuest) {
                $('#nav-guest').removeClass('visually-hidden');
                $('#nav-user').addClass('visually-hidden');
            }
            else {
                $('#nav-user').removeClass('visually-hidden');
                $('#nav-guest').addClass('visually-hidden');
            }
        }
    });
})