package softbeep.server.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@RestController
@RequestMapping("/ambulance")
public class AmbulanceController {

    @GetMapping(path="/events", produces = MediaType.APPLICATION_JSON_VALUE)
    public  handle() {
        SseEmitter emitter = new SseEmitter();

        return emitter;
    }

}
