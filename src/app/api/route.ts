import { NextResponse, NextRequest } from 'next/server';

const tracks: string[] = [];

export interface GetResponse {
	message: 'server error' | 'success';
	tracks: string[];
}

export interface PostResponse {
	message: 'server error' | 'success';
	trackName: string;
}

export interface PostBody {
	trackName: string;
}

export async function GET(): Promise<NextResponse<GetResponse>> {
	try {
		return NextResponse.json({
			message: 'success',
			tracks: tracks,
		});
	} catch (error) {
		console.log('Error: ', error);
		return NextResponse.json(
			{
				message: 'server error',
				tracks: [],
			},
			{ status: 500 }
		);
	}
}

export async function POST(
	request: NextRequest
): Promise<NextResponse<PostResponse>> {
	try {
		const body: PostBody = await request.json();

		if (!body.trackName) {
			return NextResponse.json(
				{
					message: 'server error',
					trackName: '',
				},
				{ status: 400 }
			);
		}

		tracks.push(body.trackName);

		return NextResponse.json({
			message: 'success',
			trackName: body.trackName,
		});
	} catch (error) {
		console.log('Error: ', error);
		return NextResponse.json(
			{
				message: 'server error',
				trackName: '',
			},
			{ status: 500 }
		);
	}
}
