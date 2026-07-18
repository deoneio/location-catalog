export default defineEventHandler(() => {
  return {
    data: [
      {
        id: 1,
        status: 'published',
        author_name: 'Jane Doe',
        author_title: 'Creative Director',
        content: 'ShareLoc made finding the perfect industrial space so easy! The booking process was seamless.',
        rating: 5,
        location: 1
      },
      {
        id: 2,
        status: 'published',
        author_name: 'John Smith',
        author_title: 'Photographer',
        content: 'I use ShareLoc for all my client shoots now. The variety of aesthetic styles available is unmatched.',
        rating: 5,
        location: 2
      },
      {
        id: 3,
        status: 'published',
        author_name: 'Alice Johnson',
        author_title: 'Event Planner',
        content: 'Great spaces, but I wish there were more minimalist options in my specific area.',
        rating: 4,
        location: 3
      }
    ]
  };
});
