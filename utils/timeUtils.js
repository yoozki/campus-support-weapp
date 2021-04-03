import moment from '../miniprogram_npm/moment/index'

export default function(deliveryTime) {
    moment.calendarFormat = function (myMoment, now) {
      var diff = myMoment.diff(now, 'days', true);
      var nextMonth = now.clone().add(1, 'month');
      var retVal =  diff < -6 ? 'sameElse' :
          diff < -1 ? 'lastWeek' :
          diff < 0 ? 'lastDay' :
          diff < 1 ? 'sameDay' :
          diff < 2 ? 'nextDay' :
          // 设置后天的定义
          diff < 3 ? 'afterNextDay' :
          (myMoment.month() === now.month() && myMoment.year() === now.year()) ? 'thisMonth' :
          (nextMonth.month() === myMoment.month() && nextMonth.year() === myMoment.year()) ? 'nextMonth' : 'sameElse';
      return retVal;
    }
    return moment(deliveryTime).calendar(null, {
      sameDay: '[今天] HH:MM [前]',
      nextDay: '[明天] HH:MM [前]',
      afterNextDay: '[后天] HH:MM [前]',
    })
}