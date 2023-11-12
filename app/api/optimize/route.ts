import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import moment from 'moment-timezone';

export async function GET(request: NextRequest) {

  const momentTz = moment().tz('America/Lima')
  const searchParams = request.nextUrl.searchParams
  const locations = searchParams.getAll('locations')
  const parsedLocations = locations.map(loc => {
    const [lat, lon] = loc.split(',').map(Number);
    return { lat, lon };
  });

  const body = {
    locations: parsedLocations,
    costing: 'auto',
    directions_type: 'none',
    date_time: {
      type: 1,
      value: momentTz.format('YYYY-MM-DDThh:mm')
    },
    costing_options: {
      auto: {
        top_speed: '20'
      }
    }
  }
  const path: string | undefined = process.env.VALLHALLA_API 
  if(!path) return NextResponse.json({ status: 500, body: 'VALLHALLA_API is not defined' });
  const data = await axios.get(path, { data: body })

  return NextResponse.json(data.data);
}