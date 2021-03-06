"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PieAllOrNothingScoringProcessor = function () {
  function PieAllOrNothingScoringProcessor(config) {
    _classCallCheck(this, PieAllOrNothingScoringProcessor);

    this._config = config;
  }

  /**
   * Calculate the allOrNothing score
   * @param sessions [{id: '1', ...}, {id: '2', ...}]
   * @param outcomes [{id: '1', score: 1}, {id: '2', score: 2}]
   * @returns {{summary: ({maxPoints, points, percentage}|*), components: *}}
   */


  _createClass(PieAllOrNothingScoringProcessor, [{
    key: "score",
    value: function score(pies, sessions, outcomes) {
      var scoreableComponents = this._getScoreableComponents(pies, sessions, outcomes);
      var componentScores = this._getComponentScores(scoreableComponents, outcomes);
      var maxPoints = this._numberOfScoreableComponents(scoreableComponents);
      var points = this._numberOfCorrectAnswers(componentScores);
      var summary = this._makeSummary(maxPoints, points);
      return {
        summary: summary,
        "components": componentScores
      };
    }
  }, {
    key: "_isComponentScoreable",
    value: function _isComponentScoreable(compJson, compSession, compOutcome) {
      return compOutcome && compOutcome.hasOwnProperty('score');
    }
  }, {
    key: "_getScoreableComponents",
    value: function _getScoreableComponents(pies, sessions, outcomes) {
      var results = {};
      for (var i = 0; i < pies.length; i++) {
        var compJson = pies[i];
        var compId = compJson.id;
        var compSession = this._findById(sessions, compId, {});
        var compOutcome = this._findById(outcomes, compId, {});
        if (this._isComponentScoreable(compJson, compSession, compOutcome)) {
          results[compId] = compJson;
        }
      }
      return results;
    }
  }, {
    key: "_getComponentScores",
    value: function _getComponentScores(scoreableComponents, outcomes) {
      var results = [];
      for (var id in scoreableComponents) {
        var score = this._findById(outcomes, id, { score: {} }).score.scaled || 0;
        results.push({
          id: id,
          score: score
        });
      }
      return results;
    }
  }, {
    key: "_numberOfScoreableComponents",
    value: function _numberOfScoreableComponents(scoreableComponents) {
      var result = 0;
      for (var id in scoreableComponents) {
        result++;
      }
      return result;
    }
  }, {
    key: "_numberOfCorrectAnswers",
    value: function _numberOfCorrectAnswers(componentScores) {
      var result = 0;
      for (var id in componentScores) {
        result += componentScores[id].score === 1 ? 1 : 0;
      }
      return result;
    }
  }, {
    key: "_makeSummary",
    value: function _makeSummary(maxPoints, points) {
      var percentage = void 0;
      if (points < maxPoints) {
        points = 0;
        percentage = 0;
      } else {
        points = maxPoints;
        percentage = 100.0;
      }
      return {
        maxPoints: maxPoints,
        points: points,
        percentage: percentage
      };
    }
  }, {
    key: "_findById",
    value: function _findById(col, id) {
      var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      for (var i = 0; i < col.length; i++) {
        if (col[i].id === id) {
          return col[i];
        }
      }
      return defaultValue;
    }
  }]);

  return PieAllOrNothingScoringProcessor;
}();

exports.default = PieAllOrNothingScoringProcessor;