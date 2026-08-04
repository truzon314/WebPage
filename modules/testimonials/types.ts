export interface Testimonial {
  id: string;
  name: string;
  roleOrLocation: string | null;
  quote: string;
  photoUrl: string | null;
  rating: number | null;
}
