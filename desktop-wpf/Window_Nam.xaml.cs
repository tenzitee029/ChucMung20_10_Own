using System.Windows;
using System.Windows.Media.Animation;

namespace ChucMung20_10
{
    public partial class Window_Nam : Window
    {
        public Window_Nam(string maleName)
        {
            InitializeComponent();
            txtMaleName.Text = $"Chào {maleName}! 👋";
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            if (FindResource("OpenAnim") is Storyboard sb) sb.Begin();
        }

        private void BtnBack_Click(object sender, RoutedEventArgs e)
        {
            new MainWindow().Show();
            this.Close();
        }
    }
}