<template>
    <div class="find-events bg-img">
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"
                        aria-expanded="false">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <router-link :to="{name: 'Home'}">
                        <a class="navbar-brand" style="font-family: 'Abril Fatface', cursive">Confer</a>
                    </router-link>
                    <div class="text-right" v-if="activeUser.hasOwnProperty('name')">
                        <!-- <p class="navbar-text">Welcome {{activeUser.name}}</p> -->
                        <button type="button" class="btn create-color navbar-btn btn-square" data-toggle="modal" data-target="#myModal3" @click="validateForm">Create Event</button>
                        <button type="button" class="btn logout-color navbar-btn logout-btn btn-square" @click="logout">Logout</button>
                    </div>
                    <div class="text-right" v-else>
                        <button type="button" class="btn login-color navbar-btn btn-square" data-toggle="modal" data-target="#myModal">Login</button>
                        <button type="button" class="btn register-color navbar-btn btn-square" data-toggle="modal" data-target="#myModal2">Sign-up</button>
                    </div>
                </div>

                <!-- MENU DROPDOWN -->
                <div class="collapse navbar-collapse text-center" id="bs-example-navbar-collapse-1">
                    <ul>
                        <li>
                            <router-link :to="{name: 'Home'}">
                                <button type="button" class="btn nav-drop-btn btn-default">Home</button>
                            </router-link>
                        </li>
                        <div v-if="activeUser.hasOwnProperty('name')">
                            <li>
                                <router-link :to="{name: 'adminEvents'}">
                                    <button type="button" class="btn nav-drop-btn btn-default">Edit Events</button>
                                </router-link>
                            </li>
                            <li>

                                <router-link :to="{name:'mySchedule'}">
                                    <button type="button" class="btn nav-drop-btn btn-default">My Schedule</button>
                                </router-link>
                            </li>
                            <li>
                                <router-link :to="{name:'userNotes'}">
                                    <button type="button" class="btn nav-drop-btn btn-default">My Notes</button>
                                </router-link>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12 main-headline">
                    <h1 style="font-size: 80px">Find Events</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-offset-3 col-xs-6">
                    <form id="find-events" class="form" @submit.prevent="findEvents">
                        <div class="input-group">
                            <input type="text" name="text" class="form-control better-text" placeholder="Find an Event by Location" required v-model='search.location'>
                            <div class="input-group-btn">
                                <button class="btn btn-submit" type="submit">
                                    <i class="glyphicon glyphicon-search"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row spacer">
                <div class="col-xs-12">
                    <div class="form-group">
                        <button type="button" class="btn btn-lg fe-btn" @click="getAllEvents">View All Events</button>
                    </div>
                </div>
            </div>
            <div v-for="event in events" class="row">
                <event :event="event"></event>
            </div>
        </div>


        <!-- LOGIN MODAL -->

        <div id="myModal" class="modal fade" role="dialog">
            <div class="user-modal-dialog modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Sign in to your account</h4>
                    </div>
                    <div class="modal-body">
                        <form id="login" class="form">
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" maxlength="57" name="email" class="form-control" placeholder="Email" required v-model='login.email'>
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="password" name="password" maxlength="20" class="form-control" placeholder="password" required v-model='login.password'>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-submit btn-default btn-square submit-color" @click="submitLogin"type="submit">Submit</button>
                            </div>
                            <div v-if="handledError == 'Invalid Email or Password'">
                                    <h4>{{handledError}}</h4>
                                </div>
                                <div v-else-if="success == 'successfully logged in'" v-on:mousemove="closeModal()">
                                    <h4>{{success}}</h4>
                                </div>
                                <div v-else></div>
                        </form>
                    </div>
                    <div class="row">
                        <div class="col-xs-offset-3 col-xs-6">
                            <!-- <div class="modal-footer"> -->
                            <button type="button" class="btn btn-default btn-square" data-dismiss="modal">Close</button>
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- SIGN UP MODAL -->

        <div id="myModal2" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Create a Confer Account</h4>
                        <p v-if="error">
                            <b>Your Passwords Do Not Match</b>
                        </p>
                    </div>
                    <div class="modal-body">
                        <form id="register" class="form">
                            <div class="form-group">
                                <label for="firstName">First Name:</label>
                                <input type="firstName" name="firstName" maxlength="20" class="form-control" placeholder="First Name" required v-model="signUp.firstName">
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name:</label>
                                <input type="lastName" name="lastName" maxlength="20" class="form-control" placeholder="Last Name" required v-model="signUp.lastName">
                            </div>
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" name="email" maxlength="57" class="form-control" placeholder="Email" required v-model="signUp.email">
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="password" name="password" maxlength="20" class="form-control" placeholder="password" required v-model="signUp.password">
                            </div>
                            <div class="form-group">
                                <label for="reEnterPassword">Re-enter Password:</label>
                                <input type="password" name="reEnterPassword" maxlength="20" class="form-control" placeholder="Re Enter Password" v-model="signUp.rPassword">
                            </div>
                            <div class="form-group">
                                <button class="btn btn-submit btn-success" data-dismiss="modal" type="submit" @click="submitRegister">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>

            </div>
        </div>

        <!-- CREATE NEW EVENT MODAL -->

        <div id="myModal3" class="modal fade" role="dialog">
            <div class="event-modal-dialog modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                                    <h1 class="modal-title">Create a New Event</h1>
                                </div>
                            </div>
                        </div>

                        <div class="modal-body">
                            <form id="createEvent" class="form">
                                <div class="form-group">
                                    <div class="row modal-space well">
                                        <div class="col-xs-6">
                                            <label for="eventName">Event Name:</label>
                                            <input type="text" name="eventName" maxlength="40" class="form-control" placeholder="What is your event called?" required
                                                v-model="event.name" required>
                                        </div>
                                        <div class="col-xs-6">
                                            <label for="logo">Your Logo:</label>
                                            <input type="text" name="logo" class="form-control" maxlength="150" placeholder="Path or URL" required v-model="event.logo">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row modal-space well">
                                        <div class="col-xs-12">
                                            <label for="description">Event Description:</label>
                                            <textarea type="text" name="description" maxlength="300" class="form-control" rows="5" placeholder="What is this event for?    Let your guests know here..."
                                                required v-model="event.description"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row modal-space well">
                                        <div class="col-xs-4">
                                            <label for="startDate">Event Start Date:</label>
                                            <input type="date" name="startDate" class="form-control" placeholder="Event Start Date" :min="date" v-model="event.startDate"
                                                required @change="validateForm">
                                            <p class="error-message text-left text-danger" v-if="!this.validator.startDate">Start date must be today or later.</p>
                                        </div>
                                        <div class="col-xs-4">
                                            <label for="endDate">Event End Date:</label>
                                            <input type="date" name="endDate" class="form-control" placeholder="Event End Date" :min="event.startDate" required v-model="event.endDate"
                                                @change="validateForm">
                                            <p class="error-message text-left text-danger" v-if="!this.validator.endDate">End date must be the same as or later than the start date.</p>
                                        </div>
                                        <div class="col-xs-4">
                                            <label for="timeZone">Time Zone:</label>
                                            <select class="form-control" v-model="event.timeZone">
                                                <option :value="timeZone" v-for="timeZone in timeZones">{{timeZone}}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="row modal-space well">
                                        <div class="col-xs-offset-3 col-xs-6 col-xs-offset-3 xs-modal-space">
                                            <label for="venue">Venue:</label>
                                            <input type="text" name="venue" class="form-control input-sm" maxlength="40" placeholder="What is the name of your venue?"
                                                required v-model="event.venue">
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-offset-3 col-xs-6 col-xs-offset-3 xs-modal-space">
                                                <label for="address">Address:</label>
                                                <input type="text" name="address" class="form-control" maxlength="50" placeholder="Venue Address" v-model="event.address"
                                                    required>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-offset-3 col-xs-4 xs-modal-space">
                                                <label for="city">City:</label>
                                                <input type="text" name="city" class="form-control" maxlength="20" placeholder="Venue City" v-model="event.city" required>
                                            </div>

                                            <div class="col-xs-3 state xs-modal-space">
                                                <label for="state">State:</label>
                                                <select class="form-control state" v-model="event.state">
                                                    <option :value="state" v-for="(postalCode, state) in locations">{{postalCode}} - {{state}}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-offset-3 col-xs-6 col-xs-offset-3">
                                                <label for="zip">Zip Code:</label>
                                                <input type="number" name="zip" maxlength="5" class="form-control" placeholder="Venue Zip" v-model="event.zip" required @change="validateForm">
                                                <!-- <p class="error-message text-left text-danger" v-if="!this.validator.zip">Zip code must be 5 characters long.</p> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <button class="btn btn-submit btn-square btn-lg fe-btn" data-dismiss="modal" @click="createEvent" type="submit" :disabled="!this.validator.form">Create Event</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-offset-3 col-xs-6">
                            <!-- <div class="modal-footer"> -->
                            <button type="button" class="btn btn-default btn-square" data-dismiss="modal">Close</button>
                            <!-- </div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import Event from './event'
    export default {
        name: 'findEvents',
        data() {
            return {
                date: Date,
                signUp: {
                    firstName: '',
                    lastName: '',
                    email: '',
                    name: '',
                    password: '',
                    rPassword: ''
                },
                error: false,
                login: {
                    email: '',
                    password: ''
                },
                event: {
                    name: '',
                    description: '',
                    venue: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    startDate: '',
                    endDate: '',
                    timeZones: '',
                    created: Date.now()
                },
                search: {
                    location: ''
                },
                validator: {
                    zip: false,
                    startDate: false,
                    endDate: false,
                    form: false
                }
            }
        },
        components: {
            Event
        },
        mounted() {
            this.$store.dispatch('authenticate')
            this.date = new Date().toJSON().split('T')[0];
            this.$store.dispatch('getAllEvents')
        },
        computed: {
            handledError(){
                return this.$store.state.error
            },
            success(){
                return this.$store.state.success
            },
            activeUser() {
                return this.$store.state.activeUser
            },
            events() {
                return this.$store.state.events
            },
            locations() {
                return this.$store.state.locations
            },
            timeZones() {
                return this.$store.state.timeZones
            }
        },
        methods: {
            closeModal(){
                $("#myModal").modal("hide")
                this.$store.dispatch('setSuccess')
            },
            validateZip() {
                this.validator.zip = (this.event.zip.length == 5)
            },
            validateStartDate() {
                this.validator.startDate = (new Date(this.event.startDate).getTime() >= new Date(this.date).getTime())
            },
            validateEndDate() {
                this.validator.endDate = (new Date(this.event.endDate).getTime() >= new Date(this.event.startDate).getTime())
            },
            validateForm() {
                this.validateZip()
                this.validateStartDate()
                this.validateEndDate()
                this.validator.form = (this.validator.zip && this.validator.startDate && this.validator.endDate)
                console.log('validator: ', this.validator)
            },
            submitLogin() {
                this.$store.dispatch('setError')
                this.$store.dispatch('login', this.login)
                this.login = {
                    email: '',
                    password: ''
                }
            },
            findEvents() {
                debugger
                this.$store.dispatch('findEvents', this.search.location)
                this.search.location = ''
            },
            getAllEvents() {
                this.$store.dispatch('getAllEvents')
            },
            submitRegister() {
                if (this.signUp.password == this.signUp.rPassword) {
                    this.signUp.name = this.signUp.firstName + ' ' + this.signUp.lastName
                    this.$store.dispatch('register', this.signUp)
                } else {
                    this.error = true
                    console.error({ error: "Passwords Do Not Match" })
                }
            },
            logout() {
                this.$store.dispatch('logout')
            },
            createEvent() {
                this.validateForm()
                if (this.validator.form) {
                    this.$store.dispatch('createEvent', { event: this.event, user: this.activeUser })
                    this.event = {
                        name: '',
                        description: '',
                        venue: '',
                        address: '',
                        city: '',
                        state: '',
                        zip: '',
                        startDate: '',
                        endDate: ''
                    }
                }

            }
        }
    }
</script>

<style>
    .spacer {
        padding-bottom: 50px;
        padding-top: 50px;
    }

    .bg-img {
        background-image: url('../assets/background-light.jpeg');
        position: relative;
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        min-height: 1000px;
    }
</style>