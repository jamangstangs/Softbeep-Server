package softbeep.server.Service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserEmitService {

    private static final int REPEAT = 1000;
    private final Map<ResponseBodyEmitter, AtomicInteger> emitterCountMap = new HashMap<>();

    public void add(ResponseBodyEmitter emitter) {
        emitterCountMap.put(emitter, new AtomicInteger(0));
    }

    @Scheduled(fixedRate = 1000L)
    public void emit() {

        List<ResponseBodyEmitter> toBeRemoved = new ArrayList<>(emitterCountMap.size());

        for (Map.Entry<ResponseBodyEmitter, AtomicInteger> entry : emitterCountMap.entrySet()) {

            Integer count = entry.getValue().incrementAndGet();
            User user = new RestTemplate().getForObject("https://jsonplaceholder.typicode.com/users/{id}", User.class, count);

            ResponseBodyEmitter emitter = entry.getKey();
            try {
                emitter.send(user);
            } catch (IOException e) {
                log.error(e.getMessage(), e);
                toBeRemoved.add(emitter);
            }

            if (count >= REPEAT) {
                toBeRemoved.add(emitter);
            }
        }

        for (ResponseBodyEmitter emitter : toBeRemoved) {
            emitterCountMap.remove(emitter);
        }
    }
}