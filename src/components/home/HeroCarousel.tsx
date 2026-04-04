'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'New Arrivals',
    subtitle: 'Discover the latest products',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
  },
  {
    id: 2,
    title: 'Big Sale',
    subtitle: 'Up to 50% off',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  },
  {
    id: 3,
    title: 'Premium Quality',
    subtitle: 'Best products guaranteed',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
  },
];

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  // console.log('index',index);
  const [isHovering, setIsHovering] = useState(false);

  const nextSlide = () =>
    setIndex((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto slide
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', height: '500px' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[index].id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${slides[index].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay */}
          <div
            style={{
              background: 'rgba(0,0,0,0.45)',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10%',
              color: '#fff',
            }}
          >
            <div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: '48px', marginBottom: '10px' }}
              >
                {slides[index].title}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ fontSize: '20px', marginBottom: '20px' }}
              >
                {slides[index].subtitle}
              </motion.p>

              <Button type="primary" size="large">
                Shop Now
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      <Button
        shape="circle"
        icon={<RightOutlined />}
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      {/* Dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
        }}
      >
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              cursor: 'pointer',
              background: i === index ? '#fff' : 'rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;