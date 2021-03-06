var login = (function (lightdm) {
	var user = document.getElementById('user'),
		pass = document.getElementById('password'),
		default_avatar = 'images/default-avatar.png',
		selected_user = null,
		password = null,
		sessions_list = document.getElementById('sessions_list'),
		debug = false;
	var selected_session = lightdm.default_session;

	// Private functions
	var debug_msg = function(msg) {
		if (debug) {
			document.body.insertAdjacentHTML(
				'beforeend',
				'<p class="debug">DEBUG: '+msg+'</p>'
			);
		}
	}

	var setup_users_list = function () {
		debug_msg('setup_users_list() called');

		var list = user;
		for (var i = 0; i < lightdm.users.length; i++) {
			if (lightdm.users.hasOwnProperty(i)) {
				var username = lightdm.users[i].name;
				var dispname = lightdm.users[i].display_name;

				list.insertAdjacentHTML(
					'beforeend',
					'<option value="'+username+'">'+username+'</option>'
				);

				debug_msg('User `'+username+'` found');
			}
		}
	};

	var setup_sessions_list = function() {
		var list = sessions_list;
		var idx = 0;
		for (var i = 0; i < lightdm.sessions.length; ++i){
			var sessionName = lightdm.sessions[i].name;
			var sessionKey = lightdm.sessions[i].key;
			if (sessionKey === selected_session){
				idx = i;
			}
			list.insertAdjacentHTML(
				'beforeend',
				'<option value="'+sessionKey+'">'+sessionName+'</option>'
			);
		}
		sessions_list.options[idx].selected = 'selected';
	};

	var select_user_from_list = function (idx) {
		var idx = idx || 0;

		find_and_display_user_picture(idx);

		if (lightdm._username) {
			lightdm.cancel_authentication();
		}

		selected_user = lightdm.users[idx].name;
		if (selected_user !== null) {
			window.start_authentication(selected_user);
		}
	};

	var find_and_display_user_picture = function (idx) {
		var profile_image = document.getElementById('profile-image');
		var image = profile_image.getElementsByTagName('img')[0];

		profile_image.style.webkitAnimationName = "none";

		if (lightdm.users[idx].image) {
			image.src = lightdm.users[idx].image;
		} else {
			image.src = default_avatar;
		}

		setTimeout(function() {
			profile_image.style.webkitAnimationDelay = 0;
			profile_image.style.webkitAnimationName = "avatar_in";
		}, 1);
	};

	// Functions that lightdm needs
	window.start_authentication = function (username) {
		lightdm.cancel_timed_login();
		lightdm.start_authentication(username);
	};
	window.provide_secret = function () {
		debug_msg('window.provide_secret() called');
		password = pass.value || null;

		if (password !== null) {
			debug_msg('window.provide_secret() password not null');
			lightdm.provide_secret(password);
		}
	};
	window.authentication_complete = function () {
		if (lightdm.is_authenticated) {
			debug_msg('Logged in');
			lightdm.login(
				lightdm.authentication_user,
				selected_session
			);
		} else {
			pass.value = '';
			pass.focus();

			lightdm.start_authentication(user.value);
		}
	};
	window.show_error = function (e) {
		console.log('Error: ' + e);
	};
	window.show_prompt = function (e) {
		console.log('Prompt: ' + e);
	};

	// exposed outside of the closure
	var init = function () {
		debug_msg('init() called');

		setup_users_list();
		select_user_from_list();
		setup_sessions_list();

		user.addEventListener('change', function (e) {
			e.preventDefault();

			var idx = e.currentTarget.selectedIndex;
			select_user_from_list(idx);
		});

		sessions_list.addEventListener('change', function() {
			selected_session = sessions_list.value;
			document.getElementById('password').focus();
		});
		document.getElementById('login-form').addEventListener('submit', function (e) {
			debug_msg('Form submitted');
			e.preventDefault();
			window.provide_secret();
		});

		document.getElementById('shutdown').addEventListener('click', function (e) {
			debug_msg('Shutting down');
			lightdm.shutdown();
		});

		document.getElementById('reboot').addEventListener('click', function (e) {
			debug_msg('Restarting');
			lightdm.restart();
		});

		document.getElementById('sleep').addEventListener('click', function (e) {
			debug_msg('Sleeping');
			lightdm.suspend();
		});
	};

	return {
		init: init
	};
} (lightdm));

login.init();
