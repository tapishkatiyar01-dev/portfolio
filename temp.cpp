#include<tuple>




int main()
{
    std::tuple<int,float,char> config = {1,5.4f,'a'};
    static_assert(std::get<2>(config) == 'a');

    std::is_same

    return 0;
}