<template>
	<div>
	<b-navbar class="is-primary">
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <h1 class="title has-text-centered has-text-white">Jenga Docs</h1>
            </b-navbar-item>
        </template>

        
    </b-navbar>
  <div class="home">
    <section class="hero is-primary is-fullheight-with-navbar">
  <div class="hero-body">
    <div class="container is-fluid">
    	 
      <h1 class="title">
        Create, Send Invoices and Receipts Safe and Securely Online.
      </h1>

      <h2 class="subtitle">
        Jenga Docs creates Invoices and Receipts which you can send safe and securely to any receipient
      </h2>
      <div class="btn has-text-centered">
      	<router-link to="/signin">
  <b-button type="is-primary" size="is-medium" inverted outlined>Get Started</b-button></router-link>
</div>

    </div>
  </div>
  <footer-view></footer-view>
</section>

  </div>
</div>
</template>

<script>
    const ModalForm = {
        props: ['phone', 'pin'],
        template: `
            <form action="">
                <div class="modal-card" style="width: auto">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Login</p>
                    </header>
                    <section class="modal-card-body">
                        <b-field label="Email">
                            <b-input
                                type="email"
                                :value="email"
                                placeholder="Your email"
                                required>
                            </b-input>
                        </b-field>

                        <b-field label="Password">
                            <b-input
                                type="password"
                                :value="password"
                                password-reveal
                                placeholder="Your password"
                                required>
                            </b-input>
                        </b-field>

                        <b-checkbox>Remember me</b-checkbox>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" type="button" @click="$parent.close()">Close</button>
                        <button class="button is-primary">Login</button>
                    </footer>
                </div>
            </form>
        `
    }

export default {
  name: 'home',
  methods: {
            imageModal() {
                this.$buefy.modal.open(
                    `<p class="image is-4by3">
                        <img src="https://buefy.org/static/img/placeholder-1280x960.png">
                    </p>`
                )
            },
            cardModal() {
                this.$buefy.modal.open({
                    parent: this,
                    component: ModalForm,
                    hasModalCard: true,
                    customClass: 'custom-class custom-class-2'
                })
            }
        }
}
</script>


<style scoped>
.logocontainer {
  width: 100%;
  height: 100%;
  background: #EEE;
  min-height: 250px;
  position: relative;
}

.logoimg {
  max-height: 100%;
  max-width: 100%;
  height: auto;
  width: auto;
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
  margin: auto;
}

</scipt>

