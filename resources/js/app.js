
		new Vue({
			el: '#crud',
			created: function () {
				this.getKeeps();

			},
			data: {

				keeps: [],
				pagination: {
					'total': 0,
                	'current_page': 0,
                	'per_page': 0,
               	 	'last_page': 0,
                	'from': 0,
                	'to': 0
				},
				newKeep: '',
				fillKeep: {'id': '', 'keep': ''},
				errors: [],
				offset: 3,

			},

			computed:{
				isActived: function() {
					return this.pagination.current_page;
				},

				pagesNumber: function() {
					if(!this.pagination.to){
						return[];
					}

				var from = this.pagination.current_page - this.offset;
						if (from < 1){
							from = 1;
						}	

					var to = from + (this.offset * 2);
				    if (to >= this.pagination.last_page){
				    	to = this.pagination.last_page;

				    }	

				    var pagesArray = [];
				    while (from <= to) {
				    	pagesArray.push(from);
				    	from++;
				    }
				    return pagesArray;

				}
			},



			methods: {
				//obtener todas las tareas
			getKeeps: function(page) {
				var urlKeeps = 'Tasks?page=' + page;
				axios.get(urlKeeps).then(response => {
					this.keeps = response.data.tasks.data,
					alert('hola');
					this.pagination = response.data.pagination
					});
				},
				//editar una tarea
				editKeep: function(keep) {
					this.fillKeep.id = keep.id;
					this.fillKeep.keep = keep.keep;
					$('#edit').modal('show');
				},

				// metodo update

				updateKeep: function(id) {
					var url = 'Tasks/' + id;
					axios.put(url, this.fillKeep).then(response => {
						this.getKeeps();
						this.fillKeep = {'id': '','keep': ''};
						this.errors =[];
						$('#edit').modal('hide'); // hide parametro para ocultar
						toastr.success('Tarea actualizada con exito');
					}).catch(error => {
						this.errors =error.response.data

					});

				},


				//eliminar una tarea
				deleteKeep: function(keep) {
					var url = 'Tasks/' + keep.id;
					axios.delete(url).then(response => { //eliminamos
						//refresca los datos para simular que estamos trabajando en tiempo real
						this.getKeeps(); //listamos
						toastr.success('eliminado correctamente'); //mandamos un mensaje

				});
			},

			createKeep: function() {
				var url = 'Tasks';
				axios.post(url, {
					keep: this.newKeep
				}).then(response => {
					this.getKeeps();
					this.newKeep = '';
					this.errors = [];
					$('#create').modal('hide');
					toastr.success(' Nueva Tarea Creada con Exito');
				}).catch(error => {
					this.errors = error.response.data
				});

			},


			changePage: function(page) {
				this.pagination.current_page = page;
				this.getKeeps(page);
			}

			}

		});