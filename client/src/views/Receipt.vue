<template>
  <div>
  	<b-navbar class="is-primary">
        <template slot="brand">
            <b-navbar-item>
                <h1 class="title has-text-centered has-text-white">Jenga Docs</h1>
            </b-navbar-item>
        </template>

        <template slot="end">
            <b-navbar-item v-model="logout" v-if="logout" tag="div">
                <div class="buttons">
                    <a @click="logoff" class="button is-primary">
                        <strong>Logout</strong>
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
    <b-tabs size="is-medium" expanded position="is-centered" class="block">
            <b-tab-item label="Create Receipt" icon="receipt">
            	<b-steps size="is-medium" v-model="activeStep" :animated="isAnimated" :has-navigation="hasNavigation" >

            <b-step-item label="Enter Your Details" icon="user" :clickable="isStepsClickable">
                <h1 class="title has-text-centered">Your Details</h1>
                <b-field label="ENTER BUSINESS / PERSONAL NAME">
		            <b-input placeholder="Enter official name to appear on receipt" class="has-text-centered" v-model="receipt.issuername"></b-input>
		        </b-field>
		        <b-field label="RECEIPT ISSUED ON (DATE CREATED)">
		            <b-datepicker v-model="receipt.issuedate"  placeholder="What Date To Issue This Receipt?">
            </b-datepicker>
		        </b-field>
            </b-step-item>

            <b-step-item label="Enter Client Details" icon="address-card" :clickable="isStepsClickable" :type="{'is-success': isProfileSuccess}">
                <h1 class="title has-text-centered">Client Details</h1>
                <b-field label="ENTER CLIENT NAME">
		            <b-input class="has-text-centered" placeholder="What is your client's name?" v-model="receipt.clientname"></b-input>
		        </b-field>
		        <b-field label="ENTER CLIENT EMAIL">
		            <b-input type="email"  placeholder="Enter client's email to send receipt" class="has-text-centered" v-model="receipt.clientemail"></b-input>
		        </b-field>
            </b-step-item>

            <b-step-item :visible="showSocial" icon="money-check-alt" label="Enter Payment Details" :clickable="isStepsClickable">
                <h1 class="title has-text-centered">Payment Info</h1>
                <b-field label="PAYMENT DESCRIPTION">
		            <b-input type="textarea" placeholder="What is the payment for?" class="has-text-centered" v-model="receipt.paymentinfo"></b-input>
		        </b-field>
		        <b-field class="has-text-centered" label="PAYMENT CURRENCY">
		        	<b-select v-model="currency" placeholder="Currency">
		                <option>KSH</option>
		                <option>$</option>
		                <option>USH</option>
		                <option>£</option>
		                <option>€</option>
		            </b-select>
		        </b-field>
		        <b-field label="PAYMENT AMOUNT">
		            <b-input type="number" placeholder="How much was paid?" class="has-text-centered" v-model="receipt.paymentamount"></b-input>
		        </b-field>

		        <b-field label="PAYMENT DATE">
		            <b-datepicker v-model="receipt.paymentdate" placeholder="When was payment made?">
            </b-datepicker>
		        </b-field>
            </b-step-item>

            <b-step-item label="Confirm Receipt" icon="eye" :clickable="isStepsClickable" disabled>
                <h1 class="title">Receipt Preview</h1>
                <div ref="content">
                <section class="hero">
				  <div class="hero-body">
				    <div class="container">

				    	<div class="header-title">
				      <h1 class="title has-text-white">
				        Receipt of Payment
				      </h1>
				  		</div>

				  		<div class="receipt-details">
				      <h2 class="subtitle">
				      	Issued on <strong>{{moment(receipt.issuedate).format('DD-MM-YYYY')}}</strong><br/>by <strong>{{ receipt.issuername.toUpperCase() }}</strong>
				      </h2>

				      	<div>
				      <h3 class="details">
				      	Amount Paid: <strong>{{currency}} {{ receipt.paymentamount }}</strong><br/>Received from: <strong>{{ receipt.clientname.toUpperCase() }}</strong><br/>Paid to: <strong>{{ receipt.issuername.toUpperCase() }}</strong><br/>Paid on: <strong>{{moment(receipt.paymentdate).format('DD/MM/YYYY')}}</strong><br/>Payment Details: <strong>{{receipt.paymentinfo.toUpperCase()}}</strong>
				      </h3>
				  		</div>

				  		</div>

				    </div>
				  </div>
				</section>
			</div>
				<div class="has-text-centered">
		            <b-button @click="sendReceipt" :loading="loading" type="is-primary">Save and Send Receipt</b-button>
		        </div>
            </b-step-item>
        </b-steps>

            </b-tab-item>

            <b-tab-item label="Create Invoice" icon="file-invoice">
            	<b-steps v-model="activeStep" :animated="isAnimated" :has-navigation="hasNavigation">
			        <b-step-item label="Enter Your Details" icon="user" :clickable="isStepsClickable">
			        	<h1 class="title has-text-centered">Your Details</h1>
		                <b-field label="ENTER BUSINESS / PERSONAL NAME">
				            <b-input placeholder="Enter official name to appear on invoice" class="has-text-centered" v-model="invoice.issuername"></b-input>
				        </b-field>
				        <b-field label="YOUR STREET ADDRESS">
				            <b-input v-model="invoice.issuerstreet" placeholder="What street are you located?"></b-input>
				        </b-field>
				        <b-field label="YOUR CITY LOCATION">
				            <b-input v-model="invoice.issuercity" placeholder="Which city are you located?"></b-input>
				        </b-field>
				        <b-field label="YOUR COUNTRY LOCATION">
				            <b-input v-model="invoice.issuercountry" placeholder="Which country are you located?"></b-input>
				        </b-field>
				        <b-field label="INVOICE ISSUED ON (DATE CREATED)">
				            <b-datepicker v-model="invoice.issuedate"  placeholder="What Date To Issue This Invoice?">
		            </b-datepicker>
				        </b-field>

			        </b-step-item>
			        <b-step-item label="Enter Client's Details" icon="address-card">

			        	<h1 class="title has-text-centered">Clients's Details</h1>
		                <b-field label="ENTER CLIENT'S NAME">
				            <b-input placeholder="What is your client's name?" class="has-text-centered" v-model="invoice.clientname"></b-input>
				        </b-field>
				        <b-field label="ENTER CLIENT EMAIL">
				            <b-input type="email" placeholder="What is your client's name?" class="has-text-centered" v-model="invoice.clientemail"></b-input>
				        </b-field>
				        <b-field label="ENTER CLIENT MOBILE">
	            		<b-input type="number" placeholder="What is your client's name?" class="has-text-centered" v-model="invoice.clientmobile"></b-input>
				        </b-field>
				        <b-field label="ENTER CLIENT STREET ADDRESS">
				            <b-input placeholder="What is your client's name?" class="has-text-centered" v-model="invoice.clientstreet"></b-input>
				        </b-field>
				        <b-field label="ENTER CLIENT CITY">
				            <b-input placeholder="What is your client's name?" class="has-text-centered" v-model="invoice.clientcity"></b-input>
				        </b-field>
				        <b-field label="ENTER CLIENT COUNTRY">
				            <b-input placeholder="What is your client's name?" class="has-text-centered" v-model="invoice.clientcountry"></b-input>
				        </b-field>
			        </b-step-item>

			        <b-step-item label="Enter Payment Details" icon="file-invoice-dollar">
			        	<h1 class="title has-text-centered">Payment Details</h1>

			        	<b-field label="Select Payment Method">
				            <b-select v-model="invoice.paymentmethod" placeholder="What Method Should Client Pay You?">
		                <option>BANK ACCOUNT</option>
		                <option>MPESA</option>
		                <option>AIRTEL MONEY</option>
		           			 </b-select>
				        </b-field>

				        <b-field label="PAYMENT DESCRIPTION">
				            <b-input type="textarea" placeholder="Enter the BANK, MPESA or AIRTEL MONEY ACCOUNT payment details?" class="has-text-centered" v-model="invoice.paymentdetails"></b-input>
				        </b-field>
			        </b-step-item>


			        <b-step-item  label="Enter Invoice Details" icon="file-invoice">
			        	<h1 class="title has-text-centered">Invoice Details</h1>
			        	<section v-for="(i, k) in invoice_dets" :key="k">
		                <b-field label="ITEM / SERVICE DESCRIPTION">
				            <b-input placeholder="Describe item or service sold." class="has-text-centered" v-model="i.itemdescription"></b-input>
				        </b-field>

				        <b-field label="ITEM / SERVICE COST">
				            <b-input type="number" placeholder="How Much For Item or Service?" class="has-text-centered" v-model="i.itemcost"></b-input>
				        </b-field>

				        <b-field label="CURRENCY">
				            <b-select v-model="i.currency" placeholder="Currency">
		                <option>KSH</option>
		                <option>$</option>
		                <option>USH</option>
		                <option>£</option>
		                <option>€</option>
		            </b-select>
				        </b-field>

				        <b-field label="ITEM / SERVICE QUANTITY">
				        	<b-numberinput v-model="i.itemquantity" placeholder="How Many Items / Services sold?"></b-numberinput>
				        </b-field>
				    </section>
				    <div class="has-text-centered">
				    <b-button @click="addNewItem" type="is-primary">add Item</b-button>
				</div>
			        </b-step-item>

			        <b-step-item label="Confirm Invoice" icon="eye">
			        	<h1 class="title">Invoice Preview</h1>
			        	<div ref="invoicepdf">

			        		<div class="tile is-12 header-title">
			        			<p class="title has-text-white"><strong>INVOICE</strong></p>
			        		</div>

				        		<div class="columns">

								  <div class="column issuer">FROM:<br/>{{ invoice.issuername }},<br/>{{ invoice.issuerstreet }},<br/>{{ invoice.issuercity }},<br/>
								  	{{ invoice.issuercountry }},<br/>(+254) {{ invoice.issuermobile }}
								  </div>
								  <div class="column client">TO:<br/>{{ invoice.clientname }}<br/>{{ invoice.clientstreet }}<br/>{{ invoice.clientcity }}<br/>
								  	{{ invoice.clientcountry }}<br/>(+254) {{ invoice.clientmobile }}
								  </div>

								</div>

								<div class="tile is-12">
									<table class="table">
									  <thead>
									    <tr>
									      <th>ITEM / SERVICE</th>
									      <th>PRICE</th>
									      <th>QUANTITY</th>
									      <th>TOTAL</th>
									    </tr>
									  </thead>
									  <tfoot>
									  	<tr>
									  		<th>Total Due: {{ total }}</th>
									  		<th>Date Issued: {{moment(invoice.issuedate).format('DD/MM/YYYY')}}</th>
									  		<th>Pay To:<br/>{{invoice.paymentmethod }}<br/>{{ invoice.paymentdetails}} </th>
									  	</tr>
									  </tfoot>
									  <tbody>
									    <tr v-for="(item,k) in invoice_dets" :key="k">
									      <th>{{ item.itemdescription}}</th>
									      <td>{{ item.currency }}{{ item.itemcost}}</td>
									      <td>{{ item.itemquantity}}</td>
									      <td>{{ item.currency }}{{ item.itemcost * item.itemquantity }}</td>
									  </tr>
									</tbody>
									</table>
								</div>

							</div>

							<div class="has-text-centered">
					            <b-button @click="sendInvoice" :loading="loading" type="is-primary">Save and Send Invoice</b-button>
					        </div>
			        	
			        </b-step-item>

			    </b-steps>
            </b-tab-item>
        </b-tabs>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import axios from 'axios'

export default {

	created() {

              this.checkusertoken()  

              console.log(localStorage.getItem('useremail'))
              console.log(localStorage.getItem('usermobile'))
            },
    mounted() {
    	this.checkusertoken()  
    },
	 data() {
            return {
                activeStep: 0,
                output: null,
                invoiceload:false,
                addnew:false,
                currency:'',
                showSocial: true,
                isAnimated: true,
                hasNavigation: true,
                customNavigation: false,
                prevIcon: 'mdi-facebook',
                nextIcon: 'next',
                isStepsClickable: false,
                isProfileSuccess: false,
                showWeekNumber: false,
                receipt: {
                	issuername:'',
                	issuedate:null,
                	clientname:'',
                	clientemail:'',
                	paymentinfo:'',
                	paymentamount:'',
                	paymentdate:null,
                },
                invoice: [{
                	issuername:'',
                	issuedate:null,
                	issuerstreet:'',
                	issuercity:'',
                	issuermobile: localStorage.getItem('usermobile'),
                	issuercountry:'',
                	clientname:'',
                	clientstreet:'',
                	clientcity:'',
                	clientcountry:'',
                	clientemail:'',
                	clientmobile:null,
                	clientaddress:'',
                	paymentmethod:'',
                	paymentdetails:''

                }],
                invoice_dets: [{
                	itemdescription:'',
                	itemcost:null,
                	currency:'',
                	itemquantity:null

                }],
                logout:false,
                success:null,
                loading:false,
                docfinal:null


            }
        },
        methods: {
        	addNewItem() {

	            this.invoice_dets.push({

	                itemdescription:'',
                	itemcost:0,
                	currency:'',
                	itemquantity:0

	            });
	        },
        	async sendReceipt() {

        		console.log('lslslsls')

        		this.loading = true

        		const contentHtml = this.$refs.content;

        		console.log(contentHtml)

        		console.log('lslslsls')

        		const options = {
			        type: 'dataURL'
			      }

			    try {

			    	this.output = await this.$html2canvas(contentHtml, options);

			    } catch(err){

			    	console.log(err)

			    }

		      	let newreceipt = new jsPDF('l', 'mm', [400, 250]);

		      	newreceipt.addImage(this.output,'JPEG',0,0,newreceipt.internal.pageSize.getWidth(),newreceipt.internal.pageSize.getHeight());

		      		var finalreceipt =  newreceipt.output('blob')

			   		const file = new FormData();

			   		console.log(localStorage.getItem('useremail'))

			   		let token = localStorage.getItem('token')


					file.append('pdf',finalreceipt)
					file.set('token', token);
					file.set('client', this.receipt.clientname)
					file.set('clientemail', this.receipt.clientemail)
					file.set('amount', this.receipt.paymentamount)
					file.set('description', this.receipt.paymentinfo)
					file.set('emailfrom', localStorage.getItem('useremail'))
					file.set('fromnames', localStorage.getItem('usernames'))

					axios.post('/api/jenga/sendreceipt',file,{ headers : { token: localStorage.getItem('token') }}).then(response => {

						console.log(response)
						
						if (response.data.title === "Receipt Sent!") {

							this.success = response.data.title

							this.receipt.issuername = ''
							this.receipt.issuedate = null
							this.receipt.clientname = ''
							this.receipt.clientemail = ''
							this.receipt.paymentinfo = ''
							this.receipt.paymentamount = ''
							this.receipt.paymentdate = null

							this.$buefy.notification.open({
			                    duration: 5000,
			                    message: response.data.title,
			                    type: 'is-success'
			                })
			                this.loading = false
							
							this.activeStep = 0
						}

					}).catch( err => {

						console.log(err)
					});
			
        	},
        	checkusertoken() {

        		if (localStorage.getItem('token') === null) {

        			this.$router.push({ name: 'signin' })
        		}

        		if (localStorage.getItem('token') != null) {

        			this.logout = true
        			this.invoice.issuermobile = localStorage.getItem('usermobile')
        		}
        	},
        	async sendInvoice() {

        		this.loading = true

        		localStorage.setItem('clientmail',this.invoice.clientemail)
        		localStorage.setItem('client',this.invoice.clientname)

			   	const contentHtml = this.$refs.invoicepdf;

			   	const options = {
			        type: 'dataURL'
			      }

			    try {

			    	this.output = await this.$html2canvas(contentHtml, options);

			    } catch(err){

			    	console.log(err)

			    }

			    const doc = new jsPDF('p', 'mm', [400, 480]);

			    doc.addImage(this.output,'JPEG', 0, 0,doc.internal.pageSize.getWidth(),doc.internal.pageSize.getHeight());

			    var pdffile = doc.output('blob');

			    const file = new FormData();

			    console.log(pdffile)

			    file.append('pdf',pdffile)
			    file.set('token', localStorage.getItem('token'))
			    file.set('fromname', localStorage.getItem('usernames'))
			    file.set('fromemail', localStorage.getItem('useremail'))
			    file.set('toname',localStorage.getItem('client'))
			    file.set('toemail',localStorage.getItem('clientmail'))

			    axios.post('/api/jenga/sendinvoice',file,{ headers : { token: localStorage.getItem('token') }}).then( response => {

						console.log(response)
						if (response.data.title === "Invoice Sent!") {

						localStorage.removeItem('client')
						localStorage.removeItem('clientmail')

						this.$buefy.notification.open({
		                    duration: 5000,
		                    message: response.data.title,
		                    type: 'is-success'
		                })

		                this.loading = false
		                this.activeStep = 0
						

					}



				}).catch(err=>{

					console.log(err)
				});


        	},

        	emailInvoice(file) {

        		console.log(file)

        	},

        	logoff() {

        		localStorage.clear()
        		this.$router.push({ name: 'home' })

        	}
        },
        computed: {
        	total: function(){
			    
			    return this.invoice_dets.reduce(function(total, item){

			      return total + (item.itemcost * item.itemquantity); 
			    },0);
			  }
        }

}
</script>

<style scoped>

.header-title {
	background-color: grey;
	padding:5px;
	color:#c02537;
}

.invoice-header {
	color:white;
}

.issuer {
	text-align:left;
	padding-top:20px;
	color:black;
	font-size:15px;
	font-weight:bold;
	padding-left:20px;
}



.client {
	text-align:right;
	padding-top:20px;
	color:black;
	font-size:15px;
	font-weight:bold;
	padding-right:40px;
}

.receipt-details {
	text-align:left;
	font-size:30px;
	
}
.details {

	font-weight:bold;
}

</style>