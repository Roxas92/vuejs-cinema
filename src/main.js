import Vue from 'vue';
import './style.scss';

import genres from './util/genres';

const app = new Vue({
	el: '#app',
	data() {
		return {
			genre: [],
			time: [],
		};
	},
	methods: {
		checkFilter(category, title, checked) {
			if (checked) {
				this[category].push(title);
			} else {
				const index = this[category].indexOf(title);
				if (index > -1) {
					this[category].splice(index, 1);
				}
			}
		},
	},
	components: {
		'movie-list': {
			template:
			`<div id="movie-list">
				<div v-for="movie in filteredMovies" class="movie">{{ movie.title }}</div>
			</div>`,
			data() {
				return {
					movies: [
						{ title: 'Pulp Fiction', genre: genres.CRIME },
						{ title: 'Home Alone', genre: genres.COMEDY },
						{ title: 'Austin Powers', genre: genres.COMEDY },
					],
				};
			},
			props: ['genre', 'time'],
			methods: {
				moviePassesGenreFilter(movie) {
					if (!this.genre.length) {
						return true;
					}

					return this.genre.find(genre => movie.genre === genre);
				},
			},
			computed: {
				filteredMovies() {
					return this.movies.filter(this.moviePassesGenreFilter);
				},
			},
		},
		'movie-filter': {
			template:
			`<div id="movie-filter">
				<h2>Movie filter</h2>
				<div class="filter-group">
					<check-filter v-for="genre in genres" :title="genre" @check-filter="checkFilter"></check-filter>
				</div>
			</div>`,
			data() {
				return {
					genres,
				};
			},
			methods: {
				checkFilter(category, title, checked) {
					this.$emit('check-filter', category, title, checked);
				},
			},
			components: {
				'check-filter': {
					template:
					`<div :class="{ 'check-filter': true, 'active': checked }" @click="checkFilter">
						<span class="checkbox"></span>
						<span class="check-filter-title">{{ title }}</span>
					</div>`,
					props: {
						title: {
							type: String,
							required: true,
						},
					},
					data() {
						return {
							checked: false,
						};
					},
					methods: {
						checkFilter() {
							this.checked = !this.checked;
							this.$emit('check-filter', 'genre', this.title, this.checked);
						},
					},
				},
			},
		},
	},
});
