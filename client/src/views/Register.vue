<template>
  <div>
  	<b-navbar class="is-primary ">
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <h1 class="title has-text-centered has-text-white">Jenga Docs</h1>
            </b-navbar-item>
        </template>

        
    </b-navbar>
  	 <b-tabs position="is-centered" class="block">
            <b-tab-item label="Register Account">
            	<h2 class="title is-2">Register Account</h2>
            	<b-field>
            <b-input v-model="regUser.names" placeholder="Full Names" icon="user" type="text"></b-input>
        </b-field>
    	<b-field>
            <b-input v-model="regUser.email" placeholder="Email" icon="mail-bulk" type="email"></b-input>
        </b-field>
      <b-field>
            <b-input v-model="regUser.mobile" icon="mobile-alt" placeholder="Number" type="number">
            </b-input>
        </b-field>
        <b-field>
            <b-input v-model="regUser.pin" type="password" icon="key" placeholder="Enter Secret Pin"
                password-reveal>
            </b-input>
        </b-field>
        <div class="buttons">	
            <b-button type="is-primary" @click="registeruser" :loading="loading" expanded>Create Account</b-button>
        </div>
            </b-tab-item>



            <b-tab-item label="Log Into Account">
            	<h2 class="title is-2">Log Into Account </h2>
      <b-field>
            <b-input v-model="logUser.mobile" icon="mobile-alt" placeholder="Number" type="number">
            </b-input>
        </b-field>
        <b-field>
            <b-input v-model="logUser.pin" icon="key" type="password" placeholder="Enter Secret Pin"
                password-reveal>
            </b-input>
        </b-field>
        <b-notification v-model="error" v-if="error" type="is-danger" aria-close-label="Close notification" role="alert">
            {{ error }}
        </b-notification>
        
        <div class="buttons">
            
            <b-button type="is-primary" @click="loginuser"  :loading="loading" expanded>Log In</b-button>
        
        </div>
        
            </b-tab-item>

        </b-tabs>
  	<section class="hero">
  <div class="hero-body">
    <div class="container">
    </div>
  </div>
</section>
    
  </div>
</template>

<script>
import axios from 'axios'

export default {
	name:'register',
	created() {

		this.checkusertoken()

	},
	mounted() {

		this.checkusertoken()

	},
	data() {
		return {
			regUser: {
				names:'',
				email:'',
				mobile:null,
				pin:null
			},
			logUser: {
				mobile:null,
				pin:null
			},
			loading:false,
			error:null
		}
	},
	methods: {
		registeruser(){

			this.loading = true

			axios.post('/api/jenga/register',this.regUser).then(response => {

				console.log(response.data.newclient)
				if (this.error) {
					this.error = null
				}

				if (response.data.title === "created") {

					localStorage.setItem('token',response.data.token)
					this.regUser.names = ''
					this.regUser.email = ''
					this.regUser.mobile = null
					this.regUser.pin = null
					this.loading = false

					//
					console.log(response)
					localStorage.setItem('usernames', response.data.newclient.names)
					localStorage.setItem('useremail', response.data.newclient.email)
					localStorage.setItem('usermobile', response.data.newclient.mobile)


					this.$router.push({ name: 'main' })

					

				}

			}).catch(err => {

				this.error = err
				this.loading = false

			})

		},
		loginuser(){

			this.loading = true
			if (this.error) {

				this.error = null

			}

			axios.post('/api/jenga/login',this.logUser).then(response => {


				if (response.data.title === "found") {

					localStorage.setItem('token',response.data.token)
					localStorage.setItem('useremail', response.data.client.email)
					localStorage.setItem('usernames', response.data.client.names)
					localStorage.setItem('usermobile', response.data.client.mobile)
					
					console.log(response.data.client.mobile)
					this.logUser.mobile = null
					this.logUser.pin = null
					this.loading = false

					this.$router.push({ name: 'main' })
					

				}
				

			}).catch(err => {

				this.error = err.response
				this.loading = false

			})

		},
		checkusertoken() {
			// If token still stored locally axios get user with token details, store localy then push main page
			if (localStorage.getItem('token') != null) {

				let token = localStorage.getItem('token')

				axios.get('/api/jenga/user',{headers: {"token": token}}).then( response => {

					if (response.data.title === "admin autheticated"){

						localStorage.setItem('useremail',response.data.account[0].email)
						localStorage.setItem('usernames',response.data.account[0].names)
						localStorage.setItem('usermobile',response.data.account[0].mobile)
						
						this.$router.push({ name: 'main' })
					}

				}).catch(err => {

					console.log(err)
				})

			}
		}
	}
	
}
</script>