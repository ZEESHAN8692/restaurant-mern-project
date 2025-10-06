import React from 'react';
import { Box, Typography, Container, Avatar, Stack } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Astrophysics Researcher',
    content: 'This platform has revolutionized how we visualize cosmic data. The interactive tools have enhanced our research capabilities tremendously.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Space Educator',
    content: 'As a teacher, I find the educational resources invaluable. My students are more engaged than ever with space science.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4
  },
  {
    id: 3,
    name: 'Dr. Emma Rodriguez',
    role: 'Planetary Scientist',
    content: 'The accuracy of the planetary data visualization is exceptional. It has become an essential tool for our research team.',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
    rating: 5
  },
  {
    id: 4,
    name: 'David Park',
    role: 'Amateur Astronomer',
    content: 'Never before has space exploration felt so accessible. The user-friendly interface makes complex data understandable.',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    rating: 5
  },
  {
    id: 5,
    name: 'Lisa Wong',
    role: 'Science Communicator',
    content: 'The beautiful visualizations help me explain complex cosmic concepts to my audience with ease and clarity.',
    avatar: 'https://randomuser.me/api/portraits/women/85.jpg',
    rating: 4
  }
];

// Keyframe for star pop animation
const starPop = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const StyledTestimonials = styled(Box)({
  padding: '100px 0',
  backgroundColor: '#f0f4f8',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(63,81,181,0.05) 0%, transparent 70%)',
    transform: 'rotate(45deg)',
    zIndex: 0
  }
});

const TestimonialCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '40px 30px',
  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
  maxWidth: '800px',
  margin: '0 auto',
  textAlign: 'center',
  position: 'relative',
  border: '2px solid transparent',
  backgroundClip: 'padding-box',
  transition: 'transform 0.3s, box-shadow 0.3s, border 0.3s',
  zIndex: 1,
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
    border: '2px solid #3f51b5'
  }
}));

const RatingStars = ({ rating }) => {
  return (
    <Stack direction="row" justifyContent="center" spacing={0.5} mb={3}>
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          component="span"
          color={i < rating ? '#ffc107' : '#e0e0e0'}
          sx={{ animation: i < rating ? `${starPop} 0.5s ease forwards ${i * 0.1}s` : 'none', display: 'inline-block', fontSize: '1.2rem' }}
        >
          ★
        </Box>
      ))}
    </Stack>
  );
};

const Testimonials = () => {
  return (
    <StyledTestimonials>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 8,
            color: 'text.primary',
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '100px',
              height: '5px',
              background: 'linear-gradient(90deg, #3f51b5 0%, #2196f3 100%)',
              margin: '16px auto 0',
              borderRadius: '4px'
            }
          }}
        >
          What Our Users Say
        </Typography>

        <Box sx={{ py: 4 }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard>
                  <RatingStars rating={testimonial.rating} />
                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      mb: 3,
                      color: 'text.secondary',
                      fontSize: '1.1rem',
                      lineHeight: 1.8
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>
                  <Avatar
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    sx={{
                      width: 80,
                      height: 80,
                      margin: '0 auto 16px',
                      border: '3px solid #3f51b5'
                    }}
                  />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {testimonial.role}
                  </Typography>
                </TestimonialCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Container>
    </StyledTestimonials>
  );
};

export default Testimonials;
