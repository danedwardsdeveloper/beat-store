import { GetResponse, PostResponse, PostBody } from './route';

export interface ApiEndpoints {
	'/api/tracks': {
		GET: {
			response: GetResponse;
		};
		POST: {
			response: PostResponse;
			body: PostBody;
		};
	};
}
