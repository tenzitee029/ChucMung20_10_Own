using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace ChucMung20_10
{
    public partial class Window_NgocNgan : Window
    {
        private readonly DispatcherTimer _petalTimer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(450) };
        private readonly Random _rnd = new Random();

        public Window_NgocNgan()
        {
            InitializeComponent();
            _petalTimer.Tick += SpawnFallingPetal;
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            if (FindResource("OpenCardAnim") is Storyboard sb) sb.Begin();
            _petalTimer.Start();
        }

        private void SpawnFallingPetal(object? sender, EventArgs e)
        {
            Ellipse petal = new Ellipse
            {
                Width = _rnd.Next(10, 16),
                Height = _rnd.Next(6, 11),
                Fill = new SolidColorBrush(Color.FromArgb(200, 255, 182, 193))
            };
            double startX = _rnd.Next(10, 350);
            Canvas.SetLeft(petal, startX);
            Canvas.SetTop(petal, -20);
            ParticleCanvas.Children.Add(petal);

            var dur = new Duration(TimeSpan.FromSeconds(_rnd.Next(4, 7)));
            var fall = new DoubleAnimation(-20, 680, dur);
            var sway = new DoubleAnimation(startX, startX + _rnd.Next(-50, 50), dur);
            fall.Completed += (s, a) => ParticleCanvas.Children.Remove(petal);

            petal.BeginAnimation(Canvas.TopProperty, fall);
            petal.BeginAnimation(Canvas.LeftProperty, sway);
        }

        private void BtnBack_Click(object sender, RoutedEventArgs e)
        {
            _petalTimer.Stop();
            new MainWindow().Show();
            this.Close();
        }
    }
}